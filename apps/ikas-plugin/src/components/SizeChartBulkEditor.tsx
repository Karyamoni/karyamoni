"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  GARMENT_FIELDS,
  GARMENT_LABELS,
  GARMENT_TYPES,
  FIELD_LABELS,
  detectGarmentType,
  type GarmentType,
} from "@/lib/garment-types";

type MeasurementRange = { min: number | null; max: number | null };
type SizeEntry = { size: string; measurements: Record<string, MeasurementRange> };

type ProductData = {
  id: string;
  name: string;
  categoryName: string | null;
  garmentType: string | null;
  imageUrl: string | null;
  state: string;
  sizeChart: SizeEntry[];
};

// ── helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const GUIDE_STORAGE_KEY = "km_sc_guide_v1";

// All possible measurement fields for CSV (universal header)
const CSV_FIELDS = [
  "height", "weight", "chest", "waist", "hips", "length",
  "foot_length", "head_circumference", "width",
];

function getEffectiveGarmentType(product: ProductData): GarmentType {
  if (product.garmentType) return product.garmentType as GarmentType;
  if (product.categoryName) return detectGarmentType(product.categoryName);
  return "tops";
}

function buildEditorEntries(fields: string[], existing: SizeEntry[]): SizeEntry[] {
  return DEFAULT_SIZES.map((size) => {
    const found = existing.find((e) => e.size === size);
    if (found) {
      const measurements = { ...found.measurements };
      for (const f of fields) {
        if (!measurements[f]) measurements[f] = { min: null, max: null };
      }
      return { size, measurements };
    }
    return {
      size,
      measurements: Object.fromEntries(fields.map((f) => [f, { min: null, max: null }])),
    };
  });
}

function countFilled(entries: SizeEntry[], fields: string[]): number {
  return entries.filter((e) =>
    fields.some((f) => {
      const r = e.measurements[f];
      return r && (r.min != null || r.max != null);
    })
  ).length;
}

// ── CSV utilities ─────────────────────────────────────────────────────────────

function buildCsvRows(products: ProductData[], entriesMap: Map<string, SizeEntry[]>): string {
  const headerFields = CSV_FIELDS.flatMap((f) => [`${f}_min`, `${f}_max`]);
  const header = ["product_id", "product_name", "garment_type", "size", ...headerFields].join(",");

  const rows: string[] = [header];
  for (const p of products) {
    const savedEntries = entriesMap.get(p.id) ?? p.sizeChart;
    const gt = getEffectiveGarmentType(p);

    // Always emit all default sizes — merge saved data in, leave empties blank
    const sizeMap = new Map<string, SizeEntry["measurements"]>(
      savedEntries.map((e) => [e.size, e.measurements])
    );
    const allSizes = [
      ...DEFAULT_SIZES,
      ...savedEntries.map((e) => e.size).filter((s) => !DEFAULT_SIZES.includes(s)),
    ];

    for (const size of allSizes) {
      const measurements = sizeMap.get(size) ?? {};
      const cols = [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        gt,
        size,
        ...CSV_FIELDS.flatMap((f) => {
          const r = measurements[f];
          return [r?.min ?? "", r?.max ?? ""];
        }),
      ];
      rows.push(cols.join(","));
    }
  }
  return rows.join("\n");
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

type ParsedRow = {
  productId: string;
  size: string;
  measurements: Record<string, MeasurementRange>;
};

function parseCsv(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const productIdIdx = header.indexOf("product_id");
  const sizeIdx = header.indexOf("size");

  const results: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 4) continue;

    const productId = cols[productIdIdx]?.trim() ?? "";
    const size = cols[sizeIdx]?.trim() ?? "";
    if (!productId || !size) continue;

    const measurements: Record<string, MeasurementRange> = {};
    for (const field of CSV_FIELDS) {
      const minIdx = header.indexOf(`${field}_min`);
      const maxIdx = header.indexOf(`${field}_max`);
      if (minIdx === -1 && maxIdx === -1) continue;
      const minRaw = cols[minIdx]?.trim();
      const maxRaw = cols[maxIdx]?.trim();
      const min = minRaw && minRaw !== "" ? parseFloat(minRaw) : null;
      const max = maxRaw && maxRaw !== "" ? parseFloat(maxRaw) : null;
      if (min != null || max != null) {
        measurements[field] = {
          min: min != null && !isNaN(min) ? min : null,
          max: max != null && !isNaN(max) ? max : null,
        };
      }
    }
    results.push({ productId, size, measurements });
  }
  return results;
}

// ── Guide modal ───────────────────────────────────────────────────────────────

function SizeChartGuide({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#141414",
          border: "1px solid rgba(250,250,249,0.12)",
          borderRadius: "6px",
          padding: "40px",
          maxWidth: "560px",
          width: "100%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "rgba(250,250,249,0.4)",
            fontSize: "18px",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--lime, #beff5c)", marginBottom: "8px" }}>
          How Size Charts Work
        </p>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 500, letterSpacing: "-0.03em", color: "#fafaf9", marginBottom: "24px", lineHeight: 1.1 }}>
          Enter body ranges,<br />not garment sizes
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {[
            {
              n: "01",
              title: "Body measurement ranges",
              body: "Each row is a size. Each field has a min and max. Enter the body measurements a customer should have to fit that size. Example: for size M, chest 88–92 cm means any customer with a 88–92 cm chest picks M.",
            },
            {
              n: "02",
              title: "Fields change by garment type",
              body: "Shorts show Waist / Hips / Length. T-shirts show Chest / Waist. Caps show Head Circumference. The system detects type from your IKAS category name automatically.",
            },
            {
              n: "03",
              title: "Height & Weight included",
              body: "Turkish customers often ask 'I’m 180 cm / 76 kg, what size?' — fill Height and Weight ranges so the fitting room can answer this.",
            },
            {
              n: "04",
              title: "CSV import & export",
              body: "Download the CSV template, fill it in Excel or Google Sheets, and re-upload. Or export existing data to share with your team.",
            },
          ].map((step) => (
            <div key={step.n} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(250,250,249,0.2)", fontFamily: "monospace", flexShrink: 0, paddingTop: "2px" }}>
                {step.n}
              </span>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#fafaf9", marginBottom: "4px" }}>{step.title}</p>
                <p style={{ fontSize: "12px", color: "rgba(250,250,249,0.5)", lineHeight: 1.6 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "32px",
            width: "100%",
            padding: "14px",
            background: "var(--lime, #beff5c)",
            color: "#0a0a0a",
            border: "none",
            borderRadius: "3px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Got it — start filling
        </button>
      </div>
    </div>
  );
}

// ── Range cell ─────────────────────────────────────────────────────────────────

type RangeCellProps = {
  range: MeasurementRange;
  onChange: (bound: "min" | "max", val: string) => void;
};

function RangeCell({ range, onChange }: RangeCellProps) {
  const inputStyle: React.CSSProperties = {
    width: "62px",
    padding: "7px 8px",
    background: "rgba(250,250,249,0.05)",
    border: "1px solid rgba(250,250,249,0.1)",
    borderRadius: "3px",
    color: "#fafaf9",
    fontSize: "12px",
    fontFamily: "var(--font-mono, monospace)",
    textAlign: "right",
    outline: "none",
    transition: "border-color 0.1s",
  };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <input
        type="number"
        min={0}
        max={300}
        step={0.5}
        placeholder="—"
        value={range.min ?? ""}
        onChange={(e) => onChange("min", e.target.value)}
        className="sc-input"
        style={inputStyle}
      />
      <span style={{ color: "rgba(250,250,249,0.2)", fontSize: "11px", userSelect: "none" }}>–</span>
      <input
        type="number"
        min={0}
        max={300}
        step={0.5}
        placeholder="—"
        value={range.max ?? ""}
        onChange={(e) => onChange("max", e.target.value)}
        className="sc-input"
        style={inputStyle}
      />
    </div>
  );
}

// ── Product accordion item ─────────────────────────────────────────────────────

type ProductAccordionProps = {
  product: ProductData;
  isOpen: boolean;
  onToggle: () => void;
  onEntriesChange: (productId: string, entries: SizeEntry[]) => void;
  onMarkClean: (productId: string) => void;
  isSaved: boolean;
  importedEntries?: SizeEntry[] | null;
};

function ProductAccordion({
  product,
  isOpen,
  onToggle,
  onEntriesChange,
  onMarkClean,
  isSaved,
  importedEntries,
}: ProductAccordionProps) {
  const garmentType = getEffectiveGarmentType(product);
  const fields = GARMENT_FIELDS[garmentType];

  const [entries, setEntries] = useState<SizeEntry[]>(() =>
    buildEditorEntries(fields, product.sizeChart)
  );
  const [isDirty, setIsDirty] = useState(false);

  // Clear dirty dot when parent confirms save
  useEffect(() => {
    if (isSaved) setIsDirty(false);
  }, [isSaved]);

  // Apply CSV-imported entries when parent provides them
  const prevImportedRef = useRef<SizeEntry[] | null | undefined>(null);
  useEffect(() => {
    if (!importedEntries || importedEntries === prevImportedRef.current) return;
    prevImportedRef.current = importedEntries;
    const merged = buildEditorEntries(fields, importedEntries);
    setEntries(merged);
    onEntriesChange(product.id, merged);
    setIsDirty(true);
  }, [importedEntries]); // eslint-disable-line react-hooks/exhaustive-deps

  function setEntriesAndNotify(next: SizeEntry[]) {
    setEntries(next);
    onEntriesChange(product.id, next);
  }

  function updateRange(size: string, field: string, bound: "min" | "max", raw: string) {
    const val = raw === "" ? null : parseFloat(raw);
    const next = entries.map((e) => {
      if (e.size !== size) return e;
      const range = { ...e.measurements[field] };
      range[bound] = val == null || isNaN(val) ? null : val;
      return { ...e, measurements: { ...e.measurements, [field]: range } };
    });
    setEntriesAndNotify(next);
    setIsDirty(true);
    onMarkClean(product.id); // reset saved state if re-edited after save
  }

  function addCustomSize() {
    const label = prompt("Size label (e.g. 2XL, 42):");
    if (!label?.trim() || entries.find((e) => e.size === label.trim())) return;
    const next = [
      ...entries,
      {
        size: label.trim(),
        measurements: Object.fromEntries(fields.map((f) => [f, { min: null, max: null }])),
      },
    ];
    setEntriesAndNotify(next);
    setIsDirty(true);
  }

  const filled = countFilled(entries, fields);
  const total = entries.length;

  return (
    <div style={{ borderBottom: "1px solid rgba(250,250,249,0.07)" }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "11px", color: "rgba(250,250,249,0.3)", width: "14px", flexShrink: 0 }}>
          {isOpen ? "▼" : "▶"}
        </span>

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt=""
            width={40}
            height={40}
            style={{ objectFit: "cover", borderRadius: "3px", flexShrink: 0, border: "1px solid rgba(250,250,249,0.1)" }}
          />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: "3px", background: "rgba(250,250,249,0.06)", flexShrink: 0 }} />
        )}

        <span style={{ fontSize: "14px", fontWeight: 500, color: "#fafaf9", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {product.name}
        </span>

        {isDirty && (
          <span
            title="Unsaved changes"
            style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f0c040", flexShrink: 0 }}
          />
        )}

        <span
          style={{
            fontSize: "9px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
            padding: "3px 8px", borderRadius: "2px",
            border: "1px solid rgba(250,250,249,0.1)", color: "rgba(250,250,249,0.4)",
            flexShrink: 0,
          }}
        >
          {GARMENT_LABELS[garmentType]}
        </span>

        <span style={{
          fontSize: "11px", flexShrink: 0, minWidth: "52px", textAlign: "right",
          color: filled === 0 ? "rgba(250,250,249,0.25)" : filled === total ? "var(--lime, #beff5c)" : "rgba(250,250,249,0.5)",
        }}>
          {filled === 0 ? "empty" : `${filled}/${total}`}
        </span>
      </button>

      {/* Expanded */}
      {isOpen && (
        <div style={{ paddingBottom: "24px", paddingLeft: "66px", overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, paddingRight: "20px", minWidth: "40px" }}>Size</th>
                {fields.map((f) => (
                  <th key={f} style={{ ...thStyle, textAlign: "center", paddingInline: "10px", whiteSpace: "nowrap" }}>
                    {FIELD_LABELS[f] ?? f}
                    <div style={{ fontSize: "9px", color: "rgba(250,250,249,0.2)", fontWeight: 400, letterSpacing: 0, textTransform: "none", marginTop: "3px" }}>
                      min – max
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.size} style={{ borderTop: "1px solid rgba(250,250,249,0.05)" }}>
                  <td style={{ paddingBlock: "8px", paddingRight: "20px", fontSize: "12px", fontWeight: 700, color: "#fafaf9", letterSpacing: "0.04em" }}>
                    {entry.size}
                  </td>
                  {fields.map((f) => (
                    <td key={f} style={{ paddingBlock: "8px", paddingInline: "10px", textAlign: "center" }}>
                      <RangeCell
                        range={entry.measurements[f] ?? { min: null, max: null }}
                        onChange={(bound, val) => updateRange(entry.size, f, bound, val)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px", alignItems: "center" }}>
            <button
              onClick={addCustomSize}
              style={{
                padding: "9px 14px", background: "transparent",
                color: "rgba(250,250,249,0.4)", border: "1px solid rgba(250,250,249,0.1)",
                borderRadius: "3px", fontSize: "10px", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
              }}
            >
              + Add size
            </button>

            {isSaved && <span style={{ fontSize: "11px", color: "var(--lime, #beff5c)" }}>Saved</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = { products: ProductData[] };

export function SizeChartBulkEditor({ products }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<GarmentType | "all">("all");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live entries for CSV export (updated on every accordion change)
  const liveEntriesRef = useRef<Map<string, SizeEntry[]>>(new Map());
  // Imported entries to push into accordions (triggers useEffect in each accordion)
  const [importedMap, setImportedMap] = useState<Map<string, SizeEntry[]>>(new Map());
  // Track which products have unsaved changes / have just been saved
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const seen = localStorage.getItem(GUIDE_STORAGE_KEY);
    if (!seen) setShowGuide(true);
  }, []);

  function closeGuide() {
    localStorage.setItem(GUIDE_STORAGE_KEY, "1");
    setShowGuide(false);
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || getEffectiveGarmentType(p) === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [products, search, typeFilter]);

  const totalFilled = products.filter((p) => p.sizeChart.length > 0).length;

  function toggleOpen(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleEntriesChange(productId: string, entries: SizeEntry[]) {
    liveEntriesRef.current.set(productId, entries);
    setDirtyIds((prev) => new Set(prev).add(productId));
    setSavedIds((prev) => { const next = new Set(prev); next.delete(productId); return next; });
  }

  function handleMarkClean(productId: string) {
    setSavedIds((prev) => { const next = new Set(prev); next.delete(productId); return next; });
  }

  async function handleSaveAll() {
    if (dirtyIds.size === 0) return;
    setSaving(true);
    setSaveError(null);
    const items = [...dirtyIds].map((pid) => ({
      productId: pid,
      entries: liveEntriesRef.current.get(pid)
        ?? products.find((p) => p.id === pid)?.sizeChart
        ?? [],
    }));
    try {
      const res = await fetch("/api/ikas/size-charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        setSaveError(`Save failed: ${await res.text()}`);
        return;
      }
      setSavedIds(new Set(dirtyIds));
      setDirtyIds(new Set());
    } finally {
      setSaving(false);
    }
  }

  // ── CSV export ──────────────────────────────────────────────────────────────
  function handleExport() {
    const csv = buildCsvRows(products, liveEntriesRef.current);
    downloadCsv(csv, "karyamoni-size-charts.csv");
  }

  function handleDownloadTemplate() {
    // Template: same structure but all values empty
    const emptyProducts = products.map((p) => ({
      ...p,
      sizeChart: DEFAULT_SIZES.map((size) => ({
        size,
        measurements: {},
      })),
    }));
    const csv = buildCsvRows(emptyProducts, new Map());
    downloadCsv(csv, "karyamoni-size-charts-template.csv");
  }

  // ── Spreadsheet / CSV import (SheetJS handles xlsx, xls, ods, numbers, csv)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result;
      if (!data) return;

      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const csv = XLSX.utils.sheet_to_csv(sheet);

      const rows = parseCsv(csv);
      const byProduct = new Map<string, SizeEntry[]>();
      for (const row of rows) {
        if (!byProduct.has(row.productId)) byProduct.set(row.productId, []);
        byProduct.get(row.productId)!.push({ size: row.size, measurements: row.measurements });
      }
      setImportedMap(new Map(byProduct));
      setOpenIds((prev) => {
        const next = new Set(prev);
        for (const pid of byProduct.keys()) next.add(pid);
        return next;
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <>
      {showGuide && <SizeChartGuide onClose={closeGuide} />}

      <div>
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            rowGap: "8px",
          }}
        >
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              background: "rgba(250,250,249,0.05)",
              border: "1px solid rgba(250,250,249,0.1)",
              borderRadius: "3px",
              color: "#fafaf9",
              fontSize: "12px",
              outline: "none",
              width: "200px",
            }}
          />

          {/* Type filter chips */}
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {(["all", ...GARMENT_TYPES] as const).map((t) => {
              const active = typeFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  style={{
                    padding: "5px 11px", borderRadius: "2px",
                    border: active ? "1px solid var(--lime, #beff5c)" : "1px solid rgba(250,250,249,0.1)",
                    background: active ? "rgba(190,255,92,0.1)" : "transparent",
                    color: active ? "var(--lime, #beff5c)" : "rgba(250,250,249,0.4)",
                    fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em",
                    textTransform: "uppercase", cursor: "pointer",
                  }}
                >
                  {t === "all" ? "All" : GARMENT_LABELS[t]}
                </button>
              );
            })}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "rgba(250,250,249,0.3)", marginRight: "4px" }}>
              {products.length} products · {totalFilled} filled
            </span>

            {/* Save All */}
            <button
              onClick={handleSaveAll}
              disabled={saving || dirtyIds.size === 0}
              style={{
                padding: "8px 18px",
                background: dirtyIds.size === 0 ? "rgba(190,255,92,0.15)" : saving ? "rgba(190,255,92,0.4)" : "var(--lime, #beff5c)",
                color: dirtyIds.size === 0 ? "rgba(190,255,92,0.4)" : "#0a0a0a",
                border: dirtyIds.size === 0 ? "1px solid rgba(190,255,92,0.2)" : "none",
                borderRadius: "3px",
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                cursor: dirtyIds.size === 0 || saving ? "default" : "pointer",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {saving ? "Saving…" : dirtyIds.size > 0 ? `Save (${dirtyIds.size})` : "Saved"}
            </button>

            {/* CSV buttons */}
            <button
              onClick={handleDownloadTemplate}
              title="Download CSV template with your products (empty values)"
              style={csvBtnStyle}
            >
              ↓ Template
            </button>

            <button
              onClick={handleExport}
              title="Export current size chart data as CSV"
              style={csvBtnStyle}
            >
              ↓ Export CSV
            </button>

            <label
              title="Import a filled CSV file"
              style={{ ...csvBtnStyle, cursor: "pointer" }}
            >
              ↑ Import CSV
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.ods,.numbers,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>

            <button
              onClick={() => setShowGuide(true)}
              title="How does this work?"
              style={{ ...csvBtnStyle, border: "1px solid rgba(190,255,92,0.2)", color: "var(--lime, #beff5c)" }}
            >
              ?
            </button>
          </div>
        </div>

        {saveError && (
          <p style={{ fontSize: "12px", color: "#ff6b5b", marginBottom: "12px" }}>{saveError}</p>
        )}

        {/* Product list */}
        {filtered.length === 0 ? (
          <p style={{ fontSize: "13px", color: "rgba(250,250,249,0.3)", padding: "24px 0" }}>
            No products match filter.
          </p>
        ) : (
          filtered.map((product) => (
            <ProductAccordion
              key={product.id}
              product={product}
              isOpen={openIds.has(product.id)}
              onToggle={() => toggleOpen(product.id)}
              onEntriesChange={handleEntriesChange}
              onMarkClean={handleMarkClean}
              isSaved={savedIds.has(product.id)}
              importedEntries={importedMap.get(product.id) ?? null}
            />
          ))
        )}
      </div>
    </>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "rgba(250,250,249,0.3)",
  paddingBottom: "10px",
  whiteSpace: "nowrap",
};

const csvBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  background: "transparent",
  color: "rgba(250,250,249,0.45)",
  border: "1px solid rgba(250,250,249,0.12)",
  borderRadius: "3px",
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

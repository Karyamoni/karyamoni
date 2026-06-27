"use client";

import { useState } from "react";
import { GARMENT_FIELDS, FIELD_LABELS, type GarmentType } from "@/lib/garment-types";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

type MeasurementRange = { min: number | null; max: number | null };
type Entry = { size: string; measurements: Record<string, MeasurementRange> };

function buildDefaultEntries(
  fields: string[],
  initial: { size: string; measurements: Record<string, MeasurementRange> }[]
): Entry[] {
  return DEFAULT_SIZES.map((size) => {
    const existing = initial.find((e) => e.size === size);
    if (existing) return existing;
    return {
      size,
      measurements: Object.fromEntries(fields.map((f) => [f, { min: null, max: null }])),
    };
  });
}

type Props = {
  productId: string;
  garmentType: GarmentType;
  initialEntries: { size: string; measurements: Record<string, MeasurementRange> }[];
};

export function SizeChartEditor({ productId, garmentType, initialEntries }: Props) {
  const fields = GARMENT_FIELDS[garmentType];
  const [entries, setEntries] = useState<Entry[]>(() =>
    buildDefaultEntries(fields, initialEntries)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateRange(size: string, field: string, bound: "min" | "max", raw: string) {
    const val = raw === "" ? null : parseFloat(raw);
    setEntries((prev) =>
      prev.map((e) => {
        if (e.size !== size) return e;
        const range = { ...e.measurements[field] };
        range[bound] = val == null || isNaN(val) ? null : val;
        return { ...e, measurements: { ...e.measurements, [field]: range } };
      })
    );
    setSaved(false);
  }

  function addSize() {
    const label = prompt("Enter size label (e.g. 2XL, 42, XXS):");
    if (!label?.trim()) return;
    if (entries.find((e) => e.size === label.trim())) return;
    setEntries((prev) => [
      ...prev,
      {
        size: label.trim(),
        measurements: Object.fromEntries(fields.map((f) => [f, { min: null, max: null }])),
      },
    ]);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/ikas/products/${productId}/size-chart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "48px",
    padding: "5px 6px",
    background: "rgba(250,250,249,0.04)",
    border: "1px solid rgba(250,250,249,0.1)",
    borderRadius: "2px",
    color: "var(--cabin-paper, #fafaf9)",
    fontSize: "12px",
    fontFamily: "var(--font-mono, monospace)",
    fontVariantNumeric: "tabular-nums",
    textAlign: "right" as const,
    outline: "none",
  };

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={thStyle}>Size</th>
              {fields.map((f) => (
                <th key={f} style={{ ...thStyle, textAlign: "center" as const }}>
                  {FIELD_LABELS[f] ?? f}
                  <div style={{ fontSize: "9px", color: "rgba(250,250,249,0.25)", fontWeight: 400, letterSpacing: 0, textTransform: "none", marginTop: "2px" }}>
                    min – max (cm)
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.size} style={{ borderTop: "1px solid rgba(250,250,249,0.06)" }}>
                <td style={{ paddingBlock: "8px", paddingRight: "16px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--cabin-paper, #fafaf9)", whiteSpace: "nowrap" }}>
                  {entry.size}
                </td>
                {fields.map((f) => {
                  const range = entry.measurements[f] ?? { min: null, max: null };
                  return (
                    <td key={f} style={{ paddingBlock: "8px", paddingInline: "12px", textAlign: "center" as const }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <input
                          type="number"
                          min={0}
                          max={300}
                          step={0.5}
                          placeholder="—"
                          value={range.min ?? ""}
                          onChange={(e) => updateRange(entry.size, f, "min", e.target.value)}
                          style={inputStyle}
                        />
                        <span style={{ color: "rgba(250,250,249,0.3)", fontSize: "11px" }}>–</span>
                        <input
                          type="number"
                          min={0}
                          max={300}
                          step={0.5}
                          placeholder="—"
                          value={range.max ?? ""}
                          onChange={(e) => updateRange(entry.size, f, "max", e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "10px 20px",
            background: saving ? "rgba(190,255,92,0.3)" : "var(--cabin-accent, #beff5c)",
            color: "#0a0a0a",
            border: "none",
            borderRadius: "3px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: saving ? "wait" : "pointer",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>

        <button
          onClick={addSize}
          style={{
            padding: "10px 16px",
            background: "transparent",
            color: "rgba(250,250,249,0.5)",
            border: "1px solid rgba(250,250,249,0.15)",
            borderRadius: "3px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          + Add size
        </button>

        {saved && <span style={{ fontSize: "12px", color: "var(--cabin-accent, #beff5c)" }}>Saved</span>}
        {error && <span style={{ fontSize: "12px", color: "#ff6b5b" }}>{error}</span>}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(250,250,249,0.35)",
  padding: "0 12px 12px 0",
  whiteSpace: "nowrap",
};

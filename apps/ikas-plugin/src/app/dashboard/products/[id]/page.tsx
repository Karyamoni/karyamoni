import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { SizeChartEditor } from "@/components/SizeChartEditor";
import { detectGarmentType, GARMENT_LABELS, type GarmentType } from "@/lib/garment-types";
import type { MeasurementRange } from "@/components/cabin/useCabinStore";

type PageProps = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: PageProps) {
  const { id: productId } = await params;

  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      categoryName: true,
      garmentType: true,
      imageId: true,
      state: true,
      readinessScore: true,
      storeName: true,
      sizeChart: {
        select: { size: true, measurements: true },
        orderBy: { size: "asc" },
      },
    },
  });

  if (!product) notFound();

  const merchant = await db.merchant.findUnique({
    where: { storeName: product.storeName },
    select: { merchantCdnId: true },
  });

  const imageUrl =
    merchant?.merchantCdnId && product.imageId
      ? `https://cdn.myikas.com/images/${merchant.merchantCdnId}/${product.imageId}/image_720.webp`
      : null;

  const garmentType: GarmentType =
    (product.garmentType as GarmentType) ??
    (product.categoryName ? detectGarmentType(product.categoryName) : "tops");

  const sizeChartEntries = product.sizeChart.map((e) => ({
    size: e.size,
    measurements: JSON.parse(e.measurements) as Record<string, MeasurementRange>,
  }));

  const STATE_COLORS: Record<string, string> = {
    live: "#beff5c",
    ready: "#f0c040",
    missing: "#ff6b5b",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--cabin-bg, #0a0a0a)",
        color: "var(--cabin-paper, #fafaf9)",
        padding: "40px clamp(20px, 5vw, 80px)",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        <a
          href="/dashboard/products"
          style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(250,250,249,0.4)", textDecoration: "none" }}
        >
          ← Products
        </a>
        <span style={{ color: "rgba(250,250,249,0.15)" }}>/</span>
        <a
          href="/dashboard/size-charts"
          style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(250,250,249,0.4)", textDecoration: "none" }}
        >
          Size Charts
        </a>
      </div>

      {/* Product header */}
      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginBottom: "48px" }}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
            width={96}
            height={96}
            style={{ objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
          />
        )}
        <div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(250,250,249,0.4)" }}>
              {product.categoryName ?? "Uncategorized"}
            </p>
            <span
              style={{
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "2px 7px",
                borderRadius: "2px",
                border: "1px solid rgba(250,250,249,0.12)",
                color: "rgba(250,250,249,0.4)",
              }}
            >
              {GARMENT_LABELS[garmentType]}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "12px" }}>
            {product.name}
          </h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: "2px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: `1px solid ${STATE_COLORS[product.state] ?? "#888"}40`,
                color: STATE_COLORS[product.state] ?? "#888",
              }}
            >
              {product.state}
            </span>
            <span style={{ fontSize: "11px", color: "rgba(250,250,249,0.35)" }}>
              {product.readinessScore}% ready
            </span>
            <a
              href={`/dashboard/try-on?productId=${product.id}`}
              style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: "2px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                background: "rgba(190,255,92,0.1)",
                color: "var(--cabin-accent, #beff5c)",
                border: "1px solid rgba(190,255,92,0.2)",
              }}
            >
              Try On
            </a>
          </div>
        </div>
      </div>

      {/* Size chart editor */}
      <section>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(250,250,249,0.35)", marginBottom: "6px" }}>
            Body measurement ranges
          </p>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Size Chart
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(250,250,249,0.4)", marginTop: "8px", maxWidth: "420px" }}>
            Enter body measurement ranges per size (e.g. chest 88–92 cm = M). Customers compare their own measurements to find the right size.
          </p>
        </div>

        <SizeChartEditor
          productId={product.id}
          garmentType={garmentType}
          initialEntries={sizeChartEntries}
        />
      </section>
    </main>
  );
}

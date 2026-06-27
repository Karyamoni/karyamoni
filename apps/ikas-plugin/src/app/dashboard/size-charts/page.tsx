import { db } from "@/lib/db";
import { SizeChartBulkEditor } from "@/components/SizeChartBulkEditor";
import type { MeasurementRange } from "@/components/cabin/useCabinStore";

export const metadata = { title: "Size Charts — Karyamoni IKAS Plugin" };

export default async function SizeChartsPage() {
  const merchant = await db.merchant.findFirst({
    select: { storeName: true, merchantCdnId: true },
  });

  const cdnId = merchant?.merchantCdnId ?? null;

  const products = await db.product.findMany({
    orderBy: [{ readinessScore: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      categoryName: true,
      garmentType: true,
      imageId: true,
      state: true,
      sizeChart: {
        select: { size: true, measurements: true },
        orderBy: { size: "asc" },
      },
    },
  });

  const serialized = products.map((p) => ({
    id: p.id,
    name: p.name,
    categoryName: p.categoryName,
    garmentType: p.garmentType,
    imageUrl: cdnId && p.imageId
      ? `https://cdn.myikas.com/images/${cdnId}/${p.imageId}/image_180.webp`
      : null,
    state: p.state,
    sizeChart: p.sizeChart.map((e) => ({
      size: e.size,
      measurements: JSON.parse(e.measurements) as Record<string, MeasurementRange>,
    })),
  }));

  const totalFilled = serialized.filter((p) => p.sizeChart.length > 0).length;

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
      <a
        href="/dashboard/products"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(250,250,249,0.4)",
          textDecoration: "none",
          marginBottom: "32px",
        }}
      >
        ← Products
      </a>

      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(250,250,249,0.35)", marginBottom: "6px" }}>
          Garment measurements
        </p>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            marginBottom: "16px",
          }}
        >
          Size Charts
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(250,250,249,0.4)", maxWidth: "480px" }}>
          Enter body measurement ranges per size. Customers see their recommended size in the fitting room. Values are body ranges (e.g. chest 88–92 cm for size M).
        </p>
        <p style={{ fontSize: "12px", color: "rgba(250,250,249,0.25)", marginTop: "8px" }}>
          {serialized.length} products · {totalFilled} with charts · {serialized.length - totalFilled} empty
        </p>
      </div>

      <SizeChartBulkEditor products={serialized} />
    </main>
  );
}

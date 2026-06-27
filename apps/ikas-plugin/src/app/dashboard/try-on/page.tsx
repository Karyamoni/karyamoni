import { db } from "@/lib/db";
import { ThreeCabinetViewer } from "@/components/cabin/ThreeCabinetViewer";
import type { SizeChartEntry, MeasurementRange } from "@/components/cabin/useCabinStore";
import { detectGarmentType, type GarmentType } from "@/lib/garment-types";

type SearchParams = Promise<{ productId?: string; garmentUrl?: string }>;

export default async function TryOnPage({ searchParams }: { searchParams: SearchParams }) {
  const { productId, garmentUrl: rawGarmentUrl } = await searchParams;

  const DEMO_GARMENT = "/models/renomowana_hurtownia_wysokiej_jakosci/scene.gltf";

  let garmentUrl: string | null = rawGarmentUrl ?? null;
  let productName: string | null = null;
  let productImages: string[] = [];
  let sizeChart: SizeChartEntry[] = [];
  let garmentType: GarmentType | null = null;

  if (productId) {
    const product = await db.product.findUnique({
      where: { id: productId },
      select: {
        modelUrl: true,
        name: true,
        categoryName: true,
        garmentType: true,
        imageId: true,
        imageIds: true,
        storeName: true,
        sizeChart: {
          select: { size: true, measurements: true },
          orderBy: { size: "asc" },
        },
      },
    });

    if (product) {
      if (!garmentUrl) garmentUrl = product.modelUrl ?? null;
      productName = product.name;

      // Build CDN URLs for all product images
      const merchant = await db.merchant.findUnique({
        where: { storeName: product.storeName },
        select: { merchantCdnId: true },
      });

      const cdnId = merchant?.merchantCdnId;
      if (cdnId) {
        const allImageIds: string[] = product.imageIds
          ? (JSON.parse(product.imageIds) as string[])
          : product.imageId
            ? [product.imageId]
            : [];

        productImages = allImageIds.map(
          (imgId) => `https://cdn.myikas.com/images/${cdnId}/${imgId}/image_720.webp`
        );
      }

      garmentType = (product.garmentType as GarmentType) ??
        (product.categoryName ? detectGarmentType(product.categoryName) : null);

      sizeChart = product.sizeChart.map((e) => ({
        size: e.size,
        measurements: JSON.parse(e.measurements) as Record<string, MeasurementRange>,
      }));
    }
  }

  // Fallback: show demo garment if no 3D model and no product images
  if (!garmentUrl && productImages.length === 0) garmentUrl = DEMO_GARMENT;

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "var(--cabin-bg, #0a0a0a)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Nav strip */}
      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "var(--grid-gutter)",
          padding: "16px var(--grid-gutter)",
          borderBottom: "1px solid var(--cabin-border)",
          flexShrink: 0,
        }}
      >
        <div style={{ gridColumn: "1", display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "var(--caption)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--cabin-accent)",
              fontWeight: 700,
            }}
          >
            Karyamoni
          </span>
        </div>

        {productName && (
          <div
            style={{
              gridColumn: "4 / 10",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--cabin-accent)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "var(--cabin-body)",
                color: "rgba(250,250,249,0.6)",
                letterSpacing: "-0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {productName}
            </span>
          </div>
        )}

        {productImages.length === 0 && !garmentUrl && productId && (
          <div
            style={{
              gridColumn: "10 / 13",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: "var(--caption)",
                letterSpacing: "var(--caption-tracking)",
                textTransform: "uppercase",
                color: "var(--cabin-accent-alt, var(--coral))",
              }}
            >
              No images
            </span>
          </div>
        )}
      </nav>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <ThreeCabinetViewer
          garmentUrl={garmentUrl}
          productImages={productImages}
          sizeChart={sizeChart}
          garmentType={garmentType}
        />
      </div>
    </main>
  );
}

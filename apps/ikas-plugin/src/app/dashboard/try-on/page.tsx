import { db } from "@/lib/db";
import { ThreeCabinetViewer } from "@/components/cabin/ThreeCabinetViewer";

type SearchParams = Promise<{ productId?: string; garmentUrl?: string }>;

export default async function TryOnPage({ searchParams }: { searchParams: SearchParams }) {
  const { productId, garmentUrl: rawGarmentUrl } = await searchParams;

  const DEMO_GARMENT = "/models/renomowana_hurtownia_wysokiej_jakosci/scene.gltf";

  // Resolve garment URL: direct param (dev/test) or from DB product
  let garmentUrl: string | null = rawGarmentUrl ?? null;
  let productName: string | null = null;

  if (!garmentUrl && productId) {
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { modelUrl: true, name: true },
    });
    garmentUrl = product?.modelUrl ?? null;
    productName = product?.name ?? null;
  }

  // Fallback: always show demo garment so the cabin is never empty
  if (!garmentUrl) garmentUrl = DEMO_GARMENT;

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
      {/* Nav strip — asymmetric power line */}
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
        {/* Logo — col 1 */}
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

        {/* Product name — col 4–9 (asymmetric offset) */}
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

        {/* No model notice — col 10–12 */}
        {!garmentUrl && productId && (
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
              No 3D model
            </span>
          </div>
        )}
      </nav>

      {/* Cabin — fills remaining height */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <ThreeCabinetViewer garmentUrl={garmentUrl} />
      </div>
    </main>
  );
}

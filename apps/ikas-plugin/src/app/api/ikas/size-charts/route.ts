import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMerchantFromRequest } from "@/lib/auth";

type MeasurementRange = { min: number | null; max: number | null };
type EntryInput = { size: string; measurements: Record<string, MeasurementRange> };
type BulkInput = { productId: string; entries: EntryInput[] };

// GET — all products with their size charts (for bulk editor)
export async function GET(req: NextRequest) {
  const merchant = await getMerchantFromRequest(req);
  if (!merchant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const products = await db.product.findMany({
    where: { storeName: merchant.storeName },
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

  const merchantCdnId = merchant.merchantCdnId ?? null;

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      categoryName: p.categoryName,
      garmentType: p.garmentType,
      imageUrl:
        merchantCdnId && p.imageId
          ? `https://cdn.myikas.com/images/${merchantCdnId}/${p.imageId}/image_72.webp`
          : null,
      state: p.state,
      sizeChart: p.sizeChart.map((e) => ({
        size: e.size,
        measurements: JSON.parse(e.measurements) as Record<string, MeasurementRange>,
      })),
    })),
  });
}

// POST — bulk upsert for multiple products at once
export async function POST(req: NextRequest) {
  const merchant = await getMerchantFromRequest(req);
  if (!merchant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { items } = (await req.json()) as { items: BulkInput[] };

  // Verify all products belong to merchant
  const productIds = items.map((i) => i.productId);
  const ownedProducts = await db.product.findMany({
    where: { id: { in: productIds }, storeName: merchant.storeName },
    select: { id: true },
  });
  const ownedIds = new Set(ownedProducts.map((p) => p.id));

  const ops = items
    .filter((item) => ownedIds.has(item.productId))
    .flatMap(({ productId, entries }) =>
      entries.map((e) =>
        db.productSizeChart.upsert({
          where: { productId_size: { productId, size: e.size } },
          create: {
            productId,
            size: e.size,
            measurements: JSON.stringify(e.measurements),
          },
          update: {
            measurements: JSON.stringify(e.measurements),
          },
        })
      )
    );

  await db.$transaction(ops);
  return NextResponse.json({ ok: true, saved: ops.length });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMerchantFromRequest } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };
type MeasurementRange = { min: number | null; max: number | null };
type EntryInput = { size: string; measurements: Record<string, MeasurementRange> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const merchant = await getMerchantFromRequest(req);
  if (!merchant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: productId } = await params;

  const product = await db.product.findFirst({
    where: { id: productId, storeName: merchant.storeName },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const entries = await db.productSizeChart.findMany({
    where: { productId },
    orderBy: { size: "asc" },
    select: { size: true, measurements: true },
  });

  return NextResponse.json({
    sizeChart: entries.map((e) => ({
      size: e.size,
      measurements: JSON.parse(e.measurements) as Record<string, MeasurementRange>,
    })),
  });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const merchant = await getMerchantFromRequest(req);
  if (!merchant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: productId } = await params;

  const product = await db.product.findFirst({
    where: { id: productId, storeName: merchant.storeName },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { entries } = (await req.json()) as { entries: EntryInput[] };

  await db.$transaction(
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

  return NextResponse.json({ ok: true });
}

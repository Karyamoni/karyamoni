import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export type ProductState = "live" | "ready" | "missing";

export type IkasProduct = {
  id: string;
  name: string;
  category: string;
  imageUrl: string | null;
  modelUrl: string | null;
  state: ProductState;
  readinessScore: number;
  missingFields?: string[];
};

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-link-secret");
  if (secret && secret !== process.env.LINK_STORE_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const merchant = await db.merchant.findFirst({ select: { merchantCdnId: true } });
  const merchantCdnId = merchant?.merchantCdnId ?? null;

  const rows = await db.product.findMany({
    orderBy: [{ readinessScore: "desc" }, { name: "asc" }],
  });

  const products: IkasProduct[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.categoryName ?? "Uncategorized",
    imageUrl:
      merchantCdnId && row.imageId
        ? `https://cdn.myikas.com/images/${merchantCdnId}/${row.imageId}/image_720.webp`
        : null,
    modelUrl: row.modelUrl ?? null,
    state: row.state as ProductState,
    readinessScore: row.readinessScore,
    ...(row.missingFields
      ? { missingFields: JSON.parse(row.missingFields) as string[] }
      : {}),
  }));

  return NextResponse.json({ products });
}

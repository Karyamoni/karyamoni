import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMerchantFromRequest } from "@/lib/auth";

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
  const merchant = await getMerchantFromRequest(req);

  if (!merchant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const merchantCdnId = merchant.merchantCdnId ?? null;

  const rows = await db.product.findMany({
    where: { storeName: merchant.storeName },
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

import { ProductMosaic } from "@/components/ProductMosaic";
import type { IkasProduct, ProductState } from "@/app/api/ikas/products/route";
import { db } from "@/lib/db";

export const metadata = { title: "Products — Karyamoni IKAS Plugin" };

export default async function ProductsPage() {
  const merchant = await db.merchant.findFirst({
    select: { storeName: true, merchantCdnId: true },
  });

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

  return <ProductMosaic products={products} storeName={merchant?.storeName ?? null} />;
}

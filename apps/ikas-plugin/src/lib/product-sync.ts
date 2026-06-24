import { getIkas } from "@/lib/ikas-client";
import { print } from "graphql";
import { LIST_PRODUCTS, GET_PRODUCT } from "@/lib/ikas-client/graphql-requests";
import { db } from "@/lib/db";

type RawImage = { imageId: string; isMain: boolean; order: number };
type RawNode = {
  id: string;
  name: string;
  categories?: Array<{ id: string; name: string }>;
  variants?: Array<{ id: string; sku: string | null; images?: RawImage[] }>;
  attributes?: Array<{ attributeId: string; value: string | null }>;
};

export type ScoredProduct = {
  id: string;
  name: string;
  categoryName: string | null;
  imageId: string | null;
  modelUrl: string | null;
  variantCount: number;
  state: "live" | "ready" | "missing";
  readinessScore: number;
  missingFields: string[] | null;
};

const MODEL_ATTRIBUTE_ID = "3d_model_url";

export function computeProductState(node: RawNode, existingModelUrl?: string | null): ScoredProduct {
  const categoryName = node.categories?.[0]?.name ?? null;
  const variantCount = node.variants?.length ?? 0;
  const missingFields: string[] = [];

  // Pick main image from first variant, prefer isMain=true, fallback to order=1
  const allImages = node.variants?.flatMap((v) => v.images ?? []) ?? [];
  const mainImage = allImages.find((img) => img.isMain) ?? allImages.sort((a, b) => a.order - b.order)[0] ?? null;
  const imageId = mainImage?.imageId ?? null;

  // 3D model URL — read from IKAS attributes or fall through to existing DB value
  const attrModelUrl = node.attributes?.find((a) => a.attributeId === MODEL_ATTRIBUTE_ID)?.value ?? null;
  const modelUrl = attrModelUrl ?? existingModelUrl ?? null;

  let state: ScoredProduct["state"];
  let readinessScore: number;

  if (!categoryName) {
    state = "missing";
    readinessScore = 20;
    missingFields.push("Category assignment required");
  } else if (variantCount > 0 && modelUrl) {
    state = "live";
    readinessScore = 100;
  } else if (variantCount > 0) {
    state = "ready";
    readinessScore = 60;
    missingFields.push("3D model asset required");
  } else {
    state = "ready";
    readinessScore = 40;
    missingFields.push("Variant measurements", "3D model asset required");
  }

  return {
    id: node.id,
    name: node.name,
    categoryName,
    imageId,
    modelUrl,
    variantCount,
    state,
    readinessScore,
    missingFields: missingFields.length ? missingFields : null,
  };
}

type ListProductsResult = {
  listProduct: {
    count: number;
    hasNext: boolean;
    page: number;
    data: RawNode[];
  };
};

async function upsertProduct(storeName: string, node: RawNode) {
  const existing = await db.product.findUnique({ where: { id: node.id }, select: { modelUrl: true } });
  const scored = computeProductState(node, existing?.modelUrl);
  await db.product.upsert({
    where: { id: node.id },
    create: {
      id: node.id,
      storeName,
      name: scored.name,
      categoryName: scored.categoryName,
      imageId: scored.imageId,
      modelUrl: scored.modelUrl,
      variantCount: scored.variantCount,
      state: scored.state,
      readinessScore: scored.readinessScore,
      missingFields: scored.missingFields ? JSON.stringify(scored.missingFields) : null,
    },
    update: {
      name: scored.name,
      categoryName: scored.categoryName,
      imageId: scored.imageId,
      modelUrl: scored.modelUrl,
      variantCount: scored.variantCount,
      state: scored.state,
      readinessScore: scored.readinessScore,
      missingFields: scored.missingFields ? JSON.stringify(scored.missingFields) : null,
    },
  });
}

export async function syncAllProducts(storeName: string, accessToken: string): Promise<void> {
  const client = getIkas(accessToken);
  const seenIds: string[] = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const result = await client.query<ListProductsResult>({
      query: print(LIST_PRODUCTS),
      variables: { limit, page },
    });

    if (!result.isSuccess || !result.data?.listProduct) break;

    const { data: nodes, hasNext } = result.data.listProduct;

    for (const node of nodes) {
      seenIds.push(node.id);
      await upsertProduct(storeName, node);
    }

    if (!hasNext) break;
    page++;
  }

  await db.product.deleteMany({
    where: { storeName, id: { notIn: seenIds } },
  });
}

export async function syncOneProduct(storeName: string, productId: string, accessToken: string): Promise<void> {
  const client = getIkas(accessToken);
  const result = await client.query<ListProductsResult>({
    query: print(GET_PRODUCT),
    variables: { id: { eq: productId } },
  });

  const node = result.data?.listProduct?.data?.[0];
  if (!result.isSuccess || !node) return;

  await upsertProduct(storeName, node);
}

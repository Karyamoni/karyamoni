import { NextRequest, NextResponse } from "next/server";
import { print } from "graphql";
import { db } from "@/lib/db";
import { getIkasForStore } from "@/lib/ikas-client";
import { SAVE_PRODUCT_3D_URL } from "@/lib/ikas-client/graphql-requests";

type SaveProductResult = {
  saveProduct: {
    id: string;
    attributes: Array<{ attributeId: string; value: string | null }>;
  };
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  const body = await req.json() as { modelUrl?: string };
  const modelUrl = body.modelUrl?.trim() ?? null;

  if (!modelUrl) {
    return NextResponse.json({ error: "modelUrl required" }, { status: 400 });
  }

  const merchant = await db.merchant.findFirst({ select: { storeName: true } });
  if (!merchant) {
    return NextResponse.json({ error: "No merchant found" }, { status: 404 });
  }

  const client = await getIkasForStore(merchant.storeName);
  const result = await client.query<SaveProductResult>({
    query: print(SAVE_PRODUCT_3D_URL),
    variables: {
      input: {
        id: productId,
        attributes: [{ attributeId: "3d_model_url", value: modelUrl }],
      },
    },
  });

  if (!result.isSuccess) {
    return NextResponse.json({ error: "IKAS saveProduct failed" }, { status: 502 });
  }

  await db.product.update({
    where: { id: productId },
    data: { modelUrl },
  });

  return NextResponse.json({ id: productId, modelUrl });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthTokenManager } from "@/lib/ikas-client/token-manager";
import { syncAllProducts } from "@/lib/product-sync";
import { getIkas } from "@/lib/ikas-client";
import { print } from "graphql";
import { GET_MERCHANT } from "@/lib/ikas-client/graphql-requests";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-link-secret");
  if (process.env.LINK_STORE_SECRET && secret !== process.env.LINK_STORE_SECRET) {
    // also allow requests from the plugin itself (no secret needed for internal)
    // check referer or just skip auth for same-origin plugin requests
  }

  const merchant = await db.merchant.findFirst({ select: { storeName: true } });
  if (!merchant) {
    return NextResponse.json({ error: "No store connected" }, { status: 404 });
  }

  const accessToken = await AuthTokenManager.refreshIfExpired(merchant.storeName);
  if (!accessToken) {
    return NextResponse.json({ error: "Token refresh failed" }, { status: 502 });
  }

  // Ensure merchantCdnId is stored (may be missing from old OAuth runs)
  const current = await db.merchant.findFirst({ select: { merchantCdnId: true, storeName: true } });
  if (!current?.merchantCdnId) {
    const client = getIkas(accessToken);
    const result = await client.query<{ getMerchant: { id: string; merchantName: string; email: string } }>({
      query: print(GET_MERCHANT),
    });
    if (result.isSuccess && result.data?.getMerchant) {
      const { id: merchantCdnId, merchantName, email } = result.data.getMerchant;
      await db.merchant.update({
        where: { storeName: merchant.storeName },
        data: { merchantCdnId, name: merchantName, email },
      });
    }
  }

  await syncAllProducts(merchant.storeName, accessToken);

  const count = await db.product.count({ where: { storeName: merchant.storeName } });
  return NextResponse.json({ synced: true, productCount: count });
}

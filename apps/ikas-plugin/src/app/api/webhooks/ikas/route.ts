import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncOneProduct } from "@/lib/product-sync";
import { AuthTokenManager } from "@/lib/ikas-client/token-manager";
import { validateHmac } from "./hmac";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!(await validateHmac(req, rawBody))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const topic = req.headers.get("x-ikas-topic");
  const payload = JSON.parse(rawBody) as { id?: string };

  switch (topic) {
    case "product/created":
    case "product/updated": {
      const productId = payload.id;
      if (!productId) break;
      const merchant = await db.merchant.findFirst({ select: { storeName: true } });
      if (!merchant) break;
      const accessToken = await AuthTokenManager.refreshIfExpired(merchant.storeName);
      if (!accessToken) break;
      syncOneProduct(merchant.storeName, productId, accessToken).catch((err) =>
        console.error(`[webhook] ${topic} sync failed:`, err)
      );
      break;
    }

    case "product/deleted": {
      const productId = payload.id;
      if (productId) {
        await db.product.deleteMany({ where: { id: productId } }).catch(() => null);
      }
      break;
    }

    case "app/uninstalled": {
      const merchant = await db.merchant.findFirst({ select: { storeName: true } });
      if (merchant) {
        const { storeName } = merchant;
        await db.product.deleteMany({ where: { storeName } });
        await db.authToken.deleteMany({ where: { store: storeName } });
        await db.merchant.delete({ where: { storeName } });
      }
      break;
    }

    default:
      console.log("[webhook] unhandled topic:", topic);
  }

  return NextResponse.json({ received: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { OAuthAPI } from "@ikas/admin-api-client";
import { AuthTokenManager } from "@/lib/ikas-client/token-manager";
import { getIkas } from "@/lib/ikas-client";
import { print } from "graphql";
import { GET_MERCHANT } from "@/lib/ikas-client/graphql-requests";
import { db } from "@/lib/db";
import { syncAllProducts } from "@/lib/product-sync";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  const session = await getSession();

  if (session.oauthState !== state) {
    return NextResponse.json({ error: "Invalid state" }, { status: 403 });
  }

  // storeName was saved to session during /api/oauth/authorize/ikas
  const storeName = session.store;
  if (!storeName) {
    return NextResponse.json({ error: "Session missing store" }, { status: 400 });
  }

  // Store-specific token endpoint — matches authorize URL construction
  const oauthBaseUrl = OAuthAPI.getOAuthUrl({ storeName });
  const tokenRes = await fetch(`${oauthBaseUrl}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/oauth/callback/ikas`,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("[OAuth callback] token exchange failed:", err);
    return NextResponse.json({ error: "Token exchange failed" }, { status: 502 });
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  // Merchant must exist before AuthToken (FK: AuthToken.store → Merchant.storeName)
  await db.merchant.upsert({
    where: { storeName },
    create: { storeName, name: storeName, email: "", storeUrl: "" },
    update: {},
  });

  await AuthTokenManager.saveToken(storeName, {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt,
  });

  // Fetch real merchant info and update
  try {
    const client = getIkas(tokens.access_token);
    const result = await client.query<{
      getMerchant: { id: string; merchantName: string; email: string; storeName: string };
    }>({ query: print(GET_MERCHANT) });

    if (result.isSuccess && result.data?.getMerchant) {
      const { id: merchantCdnId, merchantName, email } = result.data.getMerchant;
      await db.merchant.update({
        where: { storeName },
        data: { name: merchantName, email, merchantCdnId },
      });
    }
  } catch (err) {
    console.error("[OAuth callback] merchant fetch failed:", err);
  }

  // Initial product sync — fire and forget (don't block OAuth redirect)
  syncAllProducts(storeName, tokens.access_token).catch((err) =>
    console.error("[OAuth callback] initial product sync failed:", err)
  );

  // If install was initiated from web app, link this store to the web app user
  if (session.linkToken && process.env.WEB_APP_URL && process.env.LINK_STORE_SECRET) {
    try {
      const linkRes = await fetch(`${process.env.WEB_APP_URL}/api/ikas/link-store/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-link-secret": process.env.LINK_STORE_SECRET,
        },
        body: JSON.stringify({ storeName, linkToken: session.linkToken }),
      });
      if (linkRes.ok) {
        const linkData = await linkRes.json() as { ok: boolean; storeAccessToken?: string };
        if (linkData.storeAccessToken) {
          await db.merchant.update({
            where: { storeName },
            data: { karyamoniAccessToken: linkData.storeAccessToken },
          });
        }
      }
    } catch (err) {
      console.error("[OAuth callback] web app link failed:", err);
    }
    delete session.linkToken;
  }

  delete session.oauthState;
  await session.save();

  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_DEPLOY_URL));
}

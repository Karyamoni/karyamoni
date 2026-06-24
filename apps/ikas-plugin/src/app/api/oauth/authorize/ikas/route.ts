import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { OAuthAPI } from "@ikas/admin-api-client";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeName = searchParams.get("storeName");

  if (!storeName) {
    return NextResponse.json({ error: "Missing storeName param" }, { status: 400 });
  }

  const session = await getSession();
  const state = randomBytes(16).toString("hex");
  session.oauthState = state;
  session.store = storeName;

  const linkToken = searchParams.get("link_token");
  if (linkToken) session.linkToken = linkToken;

  await session.save();

  const oauthBaseUrl = OAuthAPI.getOAuthUrl({ storeName });

  const authorizeUrl =
    `${oauthBaseUrl}/authorize` +
    `?client_id=${encodeURIComponent(process.env.NEXT_PUBLIC_CLIENT_ID!)}` +
    `&redirect_uri=${encodeURIComponent(`${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/oauth/callback/ikas`)}` +
    `&scope=${encodeURIComponent("read_products,write_products,read_orders")}` +
    `&state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(authorizeUrl);
}

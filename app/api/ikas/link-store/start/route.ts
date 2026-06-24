import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

const LINK_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const storeName = searchParams.get("storeName");
  if (!storeName) {
    return NextResponse.json({ error: "Missing storeName" }, { status: 400 });
  }

  const token = randomBytes(32).toString("hex");
  await db.ikasLinkToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + LINK_TOKEN_TTL_MS),
    },
  });

  const pluginUrl = process.env.IKAS_PLUGIN_URL;
  if (!pluginUrl) {
    return NextResponse.json({ error: "IKAS_PLUGIN_URL not configured" }, { status: 500 });
  }

  const authorizeUrl =
    `${pluginUrl}/api/oauth/authorize/ikas` +
    `?storeName=${encodeURIComponent(storeName)}` +
    `&link_token=${encodeURIComponent(token)}`;

  return NextResponse.redirect(authorizeUrl);
}

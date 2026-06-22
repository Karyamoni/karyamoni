import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  const session = await getSession();

  // CSRF nonce stored in session, verified on callback
  const state = randomBytes(16).toString("hex");
  session.oauthState = state;
  await session.save();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/oauth/callback/ikas`,
    scope: "read_products write_products read_orders",
    state,
  });

  const authUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/oauth/authorize?${params}`;
  return NextResponse.redirect(authUrl);
}

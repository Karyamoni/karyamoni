import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { AuthTokenManager } from "@/lib/ikas-client/token-manager";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const store = searchParams.get("store");

  if (!code || !state || !store) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  const session = await getSession();

  // CSRF validation
  if (session.oauthState !== state) {
    return NextResponse.json({ error: "Invalid state" }, { status: 403 });
  }

  // Exchange authorization code for tokens
  const tokenRes = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/oauth/callback/ikas`,
      }),
    }
  );

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

  await AuthTokenManager.saveToken(store, {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt,
  });

  session.store = store;
  // jwt comes from @ikas/app-bridge in the embedded iframe, not from OAuth
  delete session.oauthState;
  await session.save();

  return NextResponse.redirect(
    new URL("/dashboard", process.env.NEXT_PUBLIC_DEPLOY_URL)
  );
}

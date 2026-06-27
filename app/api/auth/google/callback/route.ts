import { NextResponse } from "next/server";
import { createSession, upsertUser, getIpFromRequest } from "@/lib/session";
import { getUserMfaStatus, createMfaPendingToken } from "@/lib/mfa";
import { db } from "@/lib/db";

const cookieName = "karyamoni_session";
const stateCookie = "karyamoni_google_state";
const nextCookie = "karyamoni_auth_next";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleProfile = {
  email?: string;
  name?: string;
  picture?: string;
};

function appUrl(request: Request) {
  return process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
}

async function getLocaleForUser(userId: string): Promise<string> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { locale: true } });
  return user?.locale ?? "tr";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${stateCookie}=`))
    ?.split("=")[1];
  const next = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${nextCookie}=`))
    ?.split("=")[1];

  if (!code || !state || !savedState || state !== decodeURIComponent(savedState)) {
    return NextResponse.redirect(new URL("/tr/login?error=google_state", appUrl(request)));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: `${appUrl(request)}/api/auth/google/callback`,
      grant_type: "authorization_code"
    })
  });
  const token = (await tokenResponse.json()) as GoogleTokenResponse;

  if (!tokenResponse.ok || !token.access_token) {
    return NextResponse.redirect(new URL("/tr/login?error=google_token", appUrl(request)));
  }

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });
  const profile = (await profileResponse.json()) as GoogleProfile;

  if (!profileResponse.ok || !profile.email) {
    return NextResponse.redirect(new URL("/tr/login?error=google_profile", appUrl(request)));
  }

  const userId = await upsertUser({
    email: profile.email,
    name: profile.name ?? profile.email,
    image: profile.picture,
    provider: "google"
  });

  const ip = getIpFromRequest(request);
  const mfa = await getUserMfaStatus(userId);

  if (mfa.enabled) {
    const locale = await getLocaleForUser(userId);
    const pendingToken = await createMfaPendingToken(userId, ip);
    const dest = new URL(`/${locale}/mfa-challenge`, appUrl(request));
    dest.searchParams.set("t", pendingToken);
    if (next) dest.searchParams.set("next", next);
    const response = NextResponse.redirect(dest);
    response.cookies.delete(stateCookie);
    response.cookies.delete(nextCookie);
    return response;
  }

  const rawToken = await createSession(userId, ip);
  const response = NextResponse.redirect(
    new URL(next ? decodeURIComponent(next) : "/tr/dashboard", appUrl(request))
  );
  response.cookies.set(cookieName, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
    path: "/"
  });
  response.cookies.delete(stateCookie);
  response.cookies.delete(nextCookie);

  return response;
}

import { NextResponse } from "next/server";
import { createCustomSession } from "@/lib/session";

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
    return NextResponse.redirect(new URL("/tr/login?error=google_state", request.url));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
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
    return NextResponse.redirect(new URL("/tr/login?error=google_token", request.url));
  }

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  });
  const profile = (await profileResponse.json()) as GoogleProfile;

  if (!profileResponse.ok || !profile.email) {
    return NextResponse.redirect(new URL("/tr/login?error=google_profile", request.url));
  }

  const session = createCustomSession({
    provider: "google",
    email: profile.email,
    name: profile.name ?? profile.email,
    image: profile.picture,
    createdAt: Date.now()
  });

  const response = NextResponse.redirect(new URL(next ? decodeURIComponent(next) : "/tr/dashboard", request.url));
  response.cookies.set("karyamoni_session", session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });
  response.cookies.delete(stateCookie);
  response.cookies.delete(nextCookie);

  return response;
}

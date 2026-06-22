import { NextResponse } from "next/server";
import { getRawSessionToken, deleteSession, clearSessionCookie } from "@/lib/session";
import { isLocale } from "@/lib/i18n";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale");

  const rawToken = await getRawSessionToken();
  if (rawToken) {
    await deleteSession(rawToken);
  }
  await clearSessionCookie();

  return NextResponse.redirect(
    new URL(`/${locale && isLocale(locale) ? locale : "tr"}`, request.url)
  );
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { consumeMfaPendingToken, getUserMfaSecret, verifyTotpCode } from "@/lib/mfa";
import { createSession, setSessionCookie, getIpFromRequest } from "@/lib/session";

const schema = z.object({
  pendingToken: z.string().min(10),
  code: z.string().length(6)
});

// Called from /mfa-challenge page after primary login succeeds
export async function POST(request: Request) {
  const ip = getIpFromRequest(request);
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const limiter = rateLimit(`mfa:challenge:${ip}`, 10);
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const userId = await consumeMfaPendingToken(parsed.data.pendingToken, ip);
  if (!userId) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const secret = await getUserMfaSecret(userId);
  if (!secret) {
    return NextResponse.json({ error: "MFA not configured" }, { status: 400 });
  }

  if (!await verifyTotpCode(secret, parsed.data.code)) {
    // Re-issue pending token so user can retry (token was consumed above)
    const { createMfaPendingToken } = await import("@/lib/mfa");
    const newPending = await createMfaPendingToken(userId, ip);
    return NextResponse.json({ error: "Invalid code", pendingToken: newPending }, { status: 401 });
  }

  const rawToken = await createSession(userId, ip);
  await setSessionCookie(rawToken);

  return NextResponse.json({ ok: true });
}

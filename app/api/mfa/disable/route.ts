import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { getUserMfaSecret, verifyTotpCode, disableMfa } from "@/lib/mfa";

const schema = z.object({ code: z.string().length(6) });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const secret = await getUserMfaSecret(user.id);
  if (!secret) {
    return NextResponse.json({ error: "MFA not enabled" }, { status: 400 });
  }

  if (!await verifyTotpCode(secret, parsed.data.code)) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  await disableMfa(user.id);
  return NextResponse.json({ ok: true });
}

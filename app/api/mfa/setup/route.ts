import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { generateTotpSecret, getTotpUri, storePendingMfaSecret, getUserMfaStatus } from "@/lib/mfa";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = await getUserMfaStatus(user.id);
  if (status.enabled) {
    return NextResponse.json({ error: "MFA already enabled" }, { status: 400 });
  }

  const secret = generateTotpSecret();
  const identity = user.email ?? user.phone ?? user.id;
  const uri = getTotpUri(secret, identity);

  await storePendingMfaSecret(user.id, secret);

  return NextResponse.json({ uri, secret });
}

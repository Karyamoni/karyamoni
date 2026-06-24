import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-link-secret");
  if (!secret || secret !== process.env.LINK_STORE_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as { storeName?: string; linkToken?: string };
  const { storeName, linkToken } = body;
  if (!storeName || !linkToken) {
    return NextResponse.json({ error: "Missing storeName or linkToken" }, { status: 400 });
  }

  const record = await db.ikasLinkToken.findUnique({ where: { token: linkToken } });
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired linkToken" }, { status: 400 });
  }

  await db.ikasLinkToken.delete({ where: { token: linkToken } });

  const profile = await db.merchantProfile.upsert({
    where: { userId: record.userId },
    create: { userId: record.userId, platform: "ikas" },
    update: {},
    select: { id: true },
  });

  const existing = await db.dashboardStore.findFirst({
    where: { merchantProfileId: profile.id, name: storeName },
    select: { id: true },
  });

  if (existing) {
    await db.dashboardStore.update({
      where: { id: existing.id },
      data: { installStatus: "connected", permissionStatus: "granted" },
    });
  } else {
    await db.dashboardStore.create({
      data: {
        merchantProfileId: profile.id,
        name: storeName,
        platform: "ikas",
        installStatus: "connected",
        permissionStatus: "granted",
      },
    });
  }

  return NextResponse.json({ ok: true });
}

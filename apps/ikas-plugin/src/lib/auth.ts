import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export type MerchantAuth = { storeName: string; merchantCdnId: string | null };

export async function getMerchantFromRequest(req: NextRequest): Promise<MerchantAuth | null> {
  const authHeader = req.headers.get("authorization");
  const rawToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (rawToken) {
    const merchant = await db.merchant.findFirst({
      where: { karyamoniAccessToken: rawToken },
      select: { storeName: true, merchantCdnId: true },
    });
    console.log("[auth] bearer token lookup:", merchant ? "found" : "not found");
    return merchant ?? null;
  }

  // fallback: plugin's own frontend uses session cookie
  const session = await getSession();
  console.log("[auth] no bearer token, session.store:", session.store ?? "EMPTY");
  if (session.store) {
    const merchant = await db.merchant.findFirst({
      where: { storeName: session.store },
      select: { storeName: true, merchantCdnId: true },
    });
    console.log("[auth] session merchant lookup:", merchant ? "found" : "not found");
    return merchant ?? null;
  }

  return null;
}

export interface IkasJwtPayload {
  storeId: string;
  storeName: string;
  email: string;
  iat: number;
  exp: number;
}

export async function getUserFromRequest(
  req: NextRequest
): Promise<IkasJwtPayload | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  if (!token) return null;

  try {
    // IKAS JWTs are signed with the CLIENT_SECRET (HS256)
    const secret = new TextEncoder().encode(process.env.CLIENT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as IkasJwtPayload;
  } catch {
    return null;
  }
}

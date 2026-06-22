import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

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

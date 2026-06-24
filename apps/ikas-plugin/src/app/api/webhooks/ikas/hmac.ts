import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export async function validateHmac(
  req: Pick<NextRequest, "headers">,
  rawBody: string
): Promise<boolean> {
  const signature = req.headers.get("x-ikas-signature");
  if (!signature) return false;

  const secret = process.env.CLIENT_SECRET;
  if (!secret) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  const trustedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signature);

  if (trustedBuf.length !== receivedBuf.length) return false;
  return timingSafeEqual(trustedBuf, receivedBuf);
}

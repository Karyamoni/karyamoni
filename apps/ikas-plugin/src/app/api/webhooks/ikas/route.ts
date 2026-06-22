import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

async function validateHmac(req: NextRequest, rawBody: string): Promise<boolean> {
  const signature = req.headers.get("x-ikas-hmac-sha256");
  if (!signature) return false;

  const expected = createHmac("sha256", process.env.CLIENT_SECRET!)
    .update(rawBody, "utf8")
    .digest("base64");

  return signature === expected;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!(await validateHmac(req, rawBody))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const topic = req.headers.get("x-ikas-topic");
  const payload = JSON.parse(rawBody);

  // Route by topic
  switch (topic) {
    case "app/uninstalled":
      // TODO: clean up AuthToken for the store
      console.log("[webhook] app uninstalled:", payload);
      break;
    case "product/updated":
      // TODO: invalidate product readiness cache
      console.log("[webhook] product updated:", payload);
      break;
    default:
      console.log("[webhook] unhandled topic:", topic);
  }

  return NextResponse.json({ received: true });
}

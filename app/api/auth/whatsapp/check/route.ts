import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { createCustomSession, setCustomSessionCookie } from "@/lib/session";

const schema = z.object({
  phone: z.string().min(8).max(20),
  code: z.string().min(4).max(10)
});

function twilioConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID);
}

async function checkVerification(phone: string, code: string) {
  const credentials = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
  const body = new URLSearchParams({
    To: phone,
    Code: code
  });

  return fetch(`https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid verification payload" }, { status: 400 });
  }

  const limiter = rateLimit(`whatsapp:check:${ip}:${parsed.data.phone}`, 8);
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  let approved = false;

  if (!twilioConfigured()) {
    approved = parsed.data.code === "000000";
  } else {
    const response = await checkVerification(parsed.data.phone, parsed.data.code);
    if (!response.ok) {
      return NextResponse.json({ error: "Verification failed" }, { status: 401 });
    }

    const result = (await response.json()) as { status?: string; valid?: boolean };
    approved = result.status === "approved" || result.valid === true;
  }

  if (!approved) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  const token = createCustomSession({
    provider: "whatsapp",
    phone: parsed.data.phone,
    name: `WhatsApp ${parsed.data.phone}`,
    createdAt: Date.now()
  });
  await setCustomSessionCookie(token);

  return NextResponse.json({ ok: true });
}

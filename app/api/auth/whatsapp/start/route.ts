import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  phone: z.string().min(8).max(20)
});

function twilioConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID);
}

async function sendVerification(phone: string, channel: "whatsapp" | "sms") {
  const credentials = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
  const body = new URLSearchParams({
    To: phone,
    Channel: channel
  });

  return fetch(`https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`, {
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
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const limiter = rateLimit(`whatsapp:start:${ip}:${parsed.data.phone}`);
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  if (!twilioConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "development",
      message: "Twilio is not configured. Use code 000000 locally."
    });
  }

  const whatsapp = await sendVerification(parsed.data.phone, "whatsapp");

  if (!whatsapp.ok && process.env.TWILIO_VERIFY_ENABLE_SMS_FALLBACK === "true") {
    const sms = await sendVerification(parsed.data.phone, "sms");
    if (sms.ok) {
      return NextResponse.json({ ok: true, channel: "sms" });
    }
  }

  if (!whatsapp.ok) {
    return NextResponse.json({ error: "Unable to send verification" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, channel: "whatsapp" });
}

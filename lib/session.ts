import crypto from "crypto";
import { cookies } from "next/headers";

const cookieName = "karyamoni_session";

type CustomSession = {
  provider: "google" | "whatsapp";
  phone?: string;
  email?: string;
  name: string;
  image?: string;
  createdAt: number;
};

export type CurrentUser = {
  name: string;
  email?: string | null;
  phone?: string | null;
  provider: "google" | "whatsapp";
};

function secret() {
  return process.env.AUTH_SECRET ?? "development-only-karyamoni-secret";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createCustomSession(payload: CustomSession) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyCustomSession(value?: string): CustomSession | null {
  if (!value) {
    return null;
  }

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as CustomSession;
  } catch {
    return null;
  }
}

export async function setCustomSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });
}

export async function clearCustomSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const custom = verifyCustomSession(cookieStore.get(cookieName)?.value);

  if (custom) {
    return {
      name: custom.name,
      phone: custom.phone,
      email: custom.email,
      provider: custom.provider
    };
  }

  return null;
}

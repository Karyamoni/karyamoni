import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";

const cookieName = "karyamoni_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type CurrentUser = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  provider: "google" | "whatsapp";
};

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function extractIp(request?: Request): string {
  if (request) {
    return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}

async function getRequestIp(): Promise<string> {
  try {
    const headerStore = await headers();
    return headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  } catch {
    return "unknown";
  }
}

// Upsert user by email or phone, return userId
export async function upsertUser(data: {
  email?: string;
  phone?: string;
  name: string;
  image?: string;
  provider: string;
}): Promise<string> {
  const where = data.email ? { email: data.email } : { phone: data.phone! };

  const user = await db.user.upsert({
    where,
    update: { name: data.name, image: data.image },
    create: {
      email: data.email,
      phone: data.phone,
      name: data.name,
      image: data.image,
      accounts: {
        create: {
          provider: data.provider,
          providerAccountId: data.email ?? data.phone!
        }
      }
    },
    select: { id: true }
  });

  return user.id;
}

// Create exclusive server-side session — deletes all existing sessions for user
export async function createSession(userId: string, ip: string): Promise<string> {
  await db.session.deleteMany({ where: { userId } });

  const rawToken = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.session.create({
    data: {
      tokenHash: hashToken(rawToken),
      userId,
      issuedIp: ip,
      lastSeenIp: ip,
      expiresAt
    }
  });

  return rawToken;
}

// Verify session: check DB, check expiry, check IP
// Returns user or null. On IP mismatch: deletes session + flags user suspicious.
export async function verifySession(rawToken: string, currentIp: string): Promise<CurrentUser | null> {
  const tokenHash = hashToken(rawToken);
  const now = new Date();

  const session = await db.session.findUnique({
    where: { tokenHash },
    include: { user: { include: { accounts: true } } }
  });

  if (!session) return null;
  if (session.expiresAt < now) {
    await db.session.delete({ where: { tokenHash } });
    return null;
  }

  // IP collision: kick session + flag user for re-authentication
  if (session.issuedIp !== "unknown" && currentIp !== "unknown" && session.issuedIp !== currentIp) {
    await db.session.delete({ where: { tokenHash } });
    await db.user.update({
      where: { id: session.userId },
      data: { suspiciousAt: now }
    });
    return null;
  }

  // Update lastSeenIp
  await db.session.update({
    where: { tokenHash },
    data: { lastSeenIp: currentIp }
  });

  const { user } = session;
  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    phone: user.phone,
    provider: user.accounts?.[0]?.provider as "google" | "whatsapp" ?? "google"
  };
}

export async function deleteSession(rawToken: string): Promise<void> {
  await db.session.deleteMany({ where: { tokenHash: hashToken(rawToken) } });
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/"
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(cookieName)?.value;
  if (!rawToken) return null;

  const ip = await getRequestIp();
  return verifySession(rawToken, ip);
}

// Use in route handlers to get raw token for deletion
export async function getRawSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value ?? null;
}

// Check if user has a suspicious login flag (IP collision)
export async function checkSuspiciousFlag(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { suspiciousAt: true }
  });
  if (!user?.suspiciousAt) return false;
  // Flag active for 24 hours
  return Date.now() - user.suspiciousAt.getTime() < 24 * 60 * 60 * 1000;
}

export async function clearSuspiciousFlag(userId: string): Promise<void> {
  await db.user.update({ where: { id: userId }, data: { suspiciousAt: null } });
}

// Route-handler helper: extract client IP from Request
export function getIpFromRequest(request: Request): string {
  return extractIp(request);
}

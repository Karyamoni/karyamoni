import crypto from "crypto";
import { generateSecret, generate, verify, generateURI } from "otplib";
import { db } from "@/lib/db";

const ENCRYPTION_KEY = process.env.MFA_ENCRYPTION_KEY ?? process.env.AUTH_SECRET ?? "fallback-dev-key-32-bytes-padded!";

function deriveKey(): Buffer {
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

function encryptSecret(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", deriveKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

function decryptSecret(ciphertext: string): string {
  const [ivHex, encryptedHex] = ciphertext.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", deriveKey(), iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function generateTotpSecret(): string {
  return generateSecret();
}

export function getTotpUri(secret: string, identity: string): string {
  return generateURI({ label: `Karyamoni:${identity}`, secret, issuer: "Karyamoni" });
}

export async function verifyTotpCode(secret: string, token: string): Promise<boolean> {
  try {
    const result = await verify({ secret, token });
    return result.valid;
  } catch {
    return false;
  }
}

export async function storePendingMfaSecret(userId: string, secret: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { mfaSecret: encryptSecret(secret), mfaEnabled: false }
  });
}

export async function enableMfa(userId: string): Promise<void> {
  await db.user.update({ where: { id: userId }, data: { mfaEnabled: true } });
}

export async function disableMfa(userId: string): Promise<void> {
  await db.user.update({ where: { id: userId }, data: { mfaEnabled: false, mfaSecret: null } });
}

export async function getUserMfaSecret(userId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { mfaSecret: true } });
  if (!user?.mfaSecret) return null;
  try {
    return decryptSecret(user.mfaSecret);
  } catch {
    return null;
  }
}

export async function getUserMfaStatus(userId: string): Promise<{ enabled: boolean; hasSecret: boolean }> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { mfaEnabled: true, mfaSecret: true }
  });
  return { enabled: user?.mfaEnabled ?? false, hasSecret: !!user?.mfaSecret };
}

const PENDING_TTL_MS = 5 * 60 * 1000;

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function createMfaPendingToken(userId: string, ip: string): Promise<string> {
  await db.mfaPendingToken.deleteMany({ where: { userId } });
  const raw = crypto.randomBytes(32).toString("base64url");
  await db.mfaPendingToken.create({
    data: {
      userId,
      tokenHash: hashToken(raw),
      ip,
      expiresAt: new Date(Date.now() + PENDING_TTL_MS)
    }
  });
  return raw;
}

export async function consumeMfaPendingToken(raw: string, _ip: string): Promise<string | null> {
  const record = await db.mfaPendingToken.findUnique({ where: { tokenHash: hashToken(raw) } });
  if (!record) return null;
  if (record.expiresAt < new Date()) {
    await db.mfaPendingToken.delete({ where: { id: record.id } });
    return null;
  }
  await db.mfaPendingToken.delete({ where: { id: record.id } });
  return record.userId;
}

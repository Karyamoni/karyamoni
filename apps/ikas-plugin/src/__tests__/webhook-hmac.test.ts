import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "crypto";

// ── helpers ──────────────────────────────────────────────────────────────────

const SECRET = "test-client-secret";

function buildSignature(body: string, secret = SECRET): string {
  return createHmac("sha256", secret).update(body, "utf8").digest("base64");
}

function makeMockRequest(body: string, headers: Record<string, string>) {
  return {
    text: async () => body,
    headers: {
      get: (key: string) => headers[key.toLowerCase()] ?? null,
    },
  };
}

// ── unit: validateHmac extracted logic ───────────────────────────────────────
// We test the pure crypto logic independently of Next.js so vitest needs no
// Next.js runtime. The implementation module exports validateHmac for testing.

import { validateHmac } from "../app/api/webhooks/ikas/hmac";

describe("validateHmac", () => {
  beforeEach(() => {
    process.env.CLIENT_SECRET = SECRET;
  });

  it("returns true for a valid X-Ikas-Signature header", async () => {
    const body = JSON.stringify({ id: "prod_123", event: "product/updated" });
    const sig = buildSignature(body);
    const req = makeMockRequest(body, { "x-ikas-signature": sig });
    expect(await validateHmac(req as any, body)).toBe(true);
  });

  it("returns false when signature is wrong", async () => {
    const body = JSON.stringify({ id: "prod_123" });
    const req = makeMockRequest(body, { "x-ikas-signature": "bad-sig" });
    expect(await validateHmac(req as any, body)).toBe(false);
  });

  it("returns false when X-Ikas-Signature header is missing", async () => {
    const body = JSON.stringify({ id: "prod_123" });
    const req = makeMockRequest(body, {});
    expect(await validateHmac(req as any, body)).toBe(false);
  });

  it("rejects a replay with tampered body", async () => {
    const originalBody = JSON.stringify({ id: "prod_123" });
    const tamperedBody = JSON.stringify({ id: "prod_999" });
    const sig = buildSignature(originalBody);
    const req = makeMockRequest(tamperedBody, { "x-ikas-signature": sig });
    expect(await validateHmac(req as any, tamperedBody)).toBe(false);
  });

  it("uses X-Ikas-Signature header (not x-ikas-hmac-sha256)", async () => {
    const body = JSON.stringify({ id: "prod_123" });
    const sig = buildSignature(body);
    // Old header name must NOT work
    const reqOldHeader = makeMockRequest(body, { "x-ikas-hmac-sha256": sig });
    expect(await validateHmac(reqOldHeader as any, body)).toBe(false);
    // Correct header must work
    const reqNewHeader = makeMockRequest(body, { "x-ikas-signature": sig });
    expect(await validateHmac(reqNewHeader as any, body)).toBe(true);
  });
});

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";

function MfaChallengeForm() {
  const params = useSearchParams();
  const router = useRouter();
  const pendingTokenRef = useRef(params.get("t") ?? "");
  const next = params.get("next") ?? "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleDigit(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(""));
      inputRefs.current[5]?.focus();
    }
  }

  async function submit(code: string) {
    setLoading(true);
    setError("");

    const res = await fetch("/api/mfa/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendingToken: pendingTokenRef.current, code })
    });

    const data = (await res.json()) as { ok?: boolean; error?: string; pendingToken?: string };

    if (data.ok) {
      router.push(next || "/tr/dashboard");
      router.refresh();
      return;
    }

    if (data.pendingToken) {
      pendingTokenRef.current = data.pendingToken;
    }
    setError(data.error ?? "Invalid code");
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    setLoading(false);
  }

  useEffect(() => {
    const code = digits.join("");
    if (code.length === 6) {
      submit(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="w-full max-w-sm px-6">
        <p className="k-label mb-2 text-[var(--color-ink-soft)]">Two-factor authentication</p>
        <h1 className="mb-8 text-4xl font-black uppercase leading-none">Enter code</h1>
        <p className="k-label mb-8 text-[var(--color-ink-soft)]">
          Open your authenticator app and enter the 6-digit code.
        </p>

        <div className="mb-6 flex gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              disabled={loading}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-14 w-full border text-center text-2xl font-black uppercase transition-colors focus:outline-none ${
                error
                  ? "border-red-500"
                  : "border-[var(--color-ink-faint)] focus:border-[var(--color-ink)]"
              } bg-[var(--color-paper)] disabled:opacity-40`}
            />
          ))}
        </div>

        {error && (
          <p className="k-label text-red-500">{error}</p>
        )}

        {loading && (
          <p className="k-label mt-4 text-[var(--color-ink-soft)]">Verifying...</p>
        )}
      </div>
    </div>
  );
}

export default function MfaChallengePage() {
  return (
    <Suspense>
      <MfaChallengeForm />
    </Suspense>
  );
}

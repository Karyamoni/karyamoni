"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import QRCode from "qrcode";

type Props = {
  userId: string;
  mfaEnabled: boolean;
};

type SetupState = "idle" | "loading" | "qr" | "confirm" | "done" | "disable";

export function MfaSection({ mfaEnabled: initialEnabled }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [state, setState] = useState<SetupState>("idle");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setEnabled(initialEnabled);
  }, [initialEnabled]);

  async function startSetup() {
    setState("loading");
    setError("");
    const res = await fetch("/api/mfa/setup", { method: "POST" });
    const data = (await res.json()) as { uri?: string; secret?: string; error?: string };
    if (!res.ok || !data.uri) {
      setError(data.error ?? "Failed to start MFA setup");
      setState("idle");
      return;
    }
    const dataUrl = await QRCode.toDataURL(data.uri, { width: 200, margin: 2 });
    setQrDataUrl(dataUrl);
    setSecret(data.secret ?? "");
    setState("qr");
  }

  async function confirmSetup() {
    if (code.length !== 6) return;
    setState("loading");
    setError("");
    const res = await fetch("/api/mfa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      setError(data.error ?? "Invalid code");
      setState("confirm");
      setCode("");
      return;
    }
    setEnabled(true);
    setState("done");
    setTimeout(() => setState("idle"), 2000);
  }

  async function confirmDisable() {
    if (code.length !== 6) return;
    setState("loading");
    setError("");
    const res = await fetch("/api/mfa/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      setError(data.error ?? "Invalid code");
      setState("disable");
      setCode("");
      return;
    }
    setEnabled(false);
    setState("idle");
  }

  function reset() {
    setState("idle");
    setCode("");
    setError("");
    setQrDataUrl("");
    setSecret("");
  }

  return (
    <div className="col-span-4 md:col-span-8 lg:col-span-6">
      {/* Status row */}
      <div className="flex items-center justify-between border-b border-[var(--color-ink-faint)] pb-5">
        <div className="flex items-center gap-3">
          {enabled ? (
            <ShieldCheck size={20} className="text-[var(--color-green)]" />
          ) : (
            <Shield size={20} className="text-[var(--color-ink-soft)]" />
          )}
          <div>
            <p className="text-lg font-black uppercase leading-none">Authenticator App</p>
            <p className="k-label mt-0.5 text-[var(--color-ink-soft)]">
              {enabled ? "Enabled — TOTP required at login" : "Disabled — login without second factor"}
            </p>
          </div>
        </div>

        {state === "idle" && (
          <button
            type="button"
            onClick={enabled ? () => { setState("disable"); setCode(""); setError(""); } : startSetup}
            className={`k-label border px-4 py-2 transition-colors ${
              enabled
                ? "border-[var(--color-ink-faint)] hover:border-red-500 hover:text-red-500"
                : "border-[var(--color-ink-faint)] hover:border-[var(--color-ink)]"
            }`}
          >
            {enabled ? "Disable" : "Enable"}
          </button>
        )}
      </div>

      {/* Loading */}
      {state === "loading" && (
        <div className="flex items-center gap-2 pt-5">
          <Loader2 size={16} className="animate-spin text-[var(--color-ink-soft)]" />
          <span className="k-label text-[var(--color-ink-soft)]">Please wait…</span>
        </div>
      )}

      {/* QR code step */}
      {state === "qr" && (
        <div className="pt-6">
          <p className="k-label mb-4 text-[var(--color-ink-soft)]">
            Scan with Google Authenticator, Authy, or any TOTP app.
          </p>
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="MFA QR code" className="mb-4 border border-[var(--color-ink-faint)]" width={200} height={200} />
          )}
          {secret && (
            <p className="k-label mb-4 text-[var(--color-ink-soft)]">
              Manual key: <span className="font-mono text-[var(--color-ink)]">{secret}</span>
            </p>
          )}
          <button
            type="button"
            onClick={() => { setState("confirm"); setCode(""); setError(""); }}
            className="k-label border border-[var(--color-ink)] px-4 py-2"
          >
            I scanned it →
          </button>
          <button type="button" onClick={reset} className="k-label ml-4 text-[var(--color-ink-soft)]">
            Cancel
          </button>
        </div>
      )}

      {/* Confirm code step (enable) */}
      {state === "confirm" && (
        <div className="pt-6">
          <p className="k-label mb-4 text-[var(--color-ink-soft)]">
            Enter the 6-digit code from your app to confirm.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && confirmSetup()}
              placeholder="000000"
              autoFocus
              className="w-36 border border-[var(--color-ink-faint)] bg-[var(--color-paper)] px-3 py-2 text-center font-mono text-xl font-black focus:border-[var(--color-ink)] focus:outline-none"
            />
            <button
              type="button"
              disabled={code.length !== 6}
              onClick={confirmSetup}
              className="k-label border border-[var(--color-ink)] px-4 py-2 disabled:opacity-40"
            >
              Confirm
            </button>
            <button type="button" onClick={() => setState("qr")} className="k-label text-[var(--color-ink-soft)]">
              Back
            </button>
          </div>
          {error && <p className="k-label mt-2 text-red-500">{error}</p>}
        </div>
      )}

      {/* Disable confirmation */}
      {state === "disable" && (
        <div className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <ShieldOff size={16} className="text-red-500" />
            <p className="k-label text-[var(--color-ink-soft)]">
              Enter current TOTP code to disable MFA.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && confirmDisable()}
              placeholder="000000"
              autoFocus
              className="w-36 border border-[var(--color-ink-faint)] bg-[var(--color-paper)] px-3 py-2 text-center font-mono text-xl font-black focus:border-[var(--color-ink)] focus:outline-none"
            />
            <button
              type="button"
              disabled={code.length !== 6}
              onClick={confirmDisable}
              className="k-label border border-red-500 px-4 py-2 text-red-500 disabled:opacity-40"
            >
              Disable MFA
            </button>
            <button type="button" onClick={reset} className="k-label text-[var(--color-ink-soft)]">
              Cancel
            </button>
          </div>
          {error && <p className="k-label mt-2 text-red-500">{error}</p>}
        </div>
      )}

      {/* Done */}
      {state === "done" && (
        <div className="flex items-center gap-2 pt-5">
          <ShieldCheck size={16} className="text-[var(--color-green)]" />
          <p className="k-label text-[var(--color-green)]">MFA enabled successfully.</p>
        </div>
      )}
    </div>
  );
}

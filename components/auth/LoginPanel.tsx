"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";

type Props = {
  locale: Locale;
  content: SiteContent;
};

export function LoginPanel({ locale, content }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? `/${locale}/dashboard`;
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendCode(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch("/api/auth/whatsapp/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    const result = await response.json();

    setLoading(false);
    if (!response.ok) {
      setStatus(result.error ?? "Unable to send verification");
      return;
    }

    setSent(true);
    setStatus(result.message ?? "Verification code sent.");
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch("/api/auth/whatsapp/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code })
    });
    const result = await response.json();

    setLoading(false);
    if (!response.ok) {
      setStatus(result.error ?? "Verification failed");
      return;
    }

    if (result.mfaRequired && result.pendingToken) {
      const dest = `/${result.locale ?? locale}/mfa-challenge?t=${encodeURIComponent(result.pendingToken)}&next=${encodeURIComponent(next)}`;
      router.push(dest);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[var(--color-ink)] pt-16 text-[var(--color-paper)]">
      <section className="border-b border-white/15">
        <div className="k-grid min-h-[420px] content-between py-6 md:py-8">
          <p className="k-label col-span-4 text-white/50 md:col-span-2">Secure entry</p>
          <h1 className="k-display col-span-4 md:col-span-6 lg:col-span-7">{content.login.title}</h1>
          <p className="col-span-4 text-xl font-bold leading-tight text-white/58 md:col-span-4 md:text-2xl lg:col-span-3">
            {content.login.lead}
          </p>
        </div>
      </section>

      <section className="k-grid py-5 md:py-8">
        <div className="col-span-4 border border-white/20 p-4 md:col-span-3 lg:col-span-4">
          <p className="k-label text-white/45">Methods</p>
          <div className="mt-16 space-y-4">
            <Signal icon={<ShieldCheck size={22} />} label="Google Cloud OAuth" />
            <Signal icon={<MessageCircle size={22} />} label="Twilio WhatsApp OTP" />
            <p className="pt-8 text-sm font-bold uppercase leading-tight text-white/45">{content.login.devHint}</p>
          </div>
        </div>

        <div className="col-span-4 border border-white/20 bg-[var(--color-paper)] text-[var(--color-ink)] md:col-span-5 lg:col-span-8">
          <a
            href={`/api/auth/google/start?next=${encodeURIComponent(next)}`}
            className="grid min-h-24 grid-cols-[1fr_auto] items-center border-b border-[var(--color-ink)] p-4 text-3xl font-black uppercase leading-none transition-colors hover:bg-[var(--color-signal)] hover:text-[var(--color-paper)] md:text-5xl"
          >
            {content.login.google}
            <ArrowRight size={42} aria-hidden />
          </a>

          <form onSubmit={sent ? verifyCode : sendCode} className="grid md:grid-cols-2">
            <label className="border-b border-[var(--color-ink)] p-4 md:border-b-0 md:border-r">
              <span className="k-label mb-8 block text-[var(--color-ink-soft)]">{content.login.whatsapp}</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={content.login.phonePlaceholder}
                className="w-full bg-transparent text-3xl font-black uppercase leading-none outline-none placeholder:text-[var(--color-ink-faint)] md:text-5xl"
              />
            </label>

            <label className="p-4">
              <span className="k-label mb-8 block text-[var(--color-ink-soft)]">Code</span>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder={sent ? content.login.codePlaceholder : "After send"}
                disabled={!sent}
                className="w-full bg-transparent text-3xl font-black uppercase leading-none outline-none placeholder:text-[var(--color-ink-faint)] disabled:opacity-45 md:text-5xl"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="grid min-h-24 grid-cols-[1fr_auto] items-center border-t border-[var(--color-ink)] bg-[var(--color-ink)] p-4 text-left text-3xl font-black uppercase leading-none text-[var(--color-paper)] transition-colors hover:bg-[var(--color-signal)] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2 md:text-5xl"
            >
              {loading ? "..." : sent ? content.login.verify : content.login.sendCode}
              <ArrowRight size={42} aria-hidden />
            </button>
          </form>

          {status && <p className="border-t border-[var(--color-ink)] p-4 text-sm font-black uppercase text-[var(--color-signal)]">{status}</p>}
        </div>
      </section>
    </main>
  );
}

function Signal({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/15 pb-4 text-xl font-black uppercase leading-none">
      <span className="text-[var(--color-signal)]">{icon}</span>
      {label}
    </div>
  );
}

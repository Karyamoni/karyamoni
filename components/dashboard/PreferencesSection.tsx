"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, MessageCircle } from "lucide-react";
import { makeAnim } from "@/components/dashboard/anim";
import { oppositeLocale, type Locale } from "@/lib/i18n";
import type { CurrentUser } from "@/lib/session";
import { MfaSection } from "@/components/dashboard/MfaSection";

type Props = { user: CurrentUser; locale: Locale; mfaEnabled: boolean };

export function PreferencesSection({ user, locale, mfaEnabled }: Props) {
  const reduced = useReducedMotion();
  const anim = makeAnim(reduced);
  const router = useRouter();
  const [switching, setSwitching] = useState(false);
  const nextLocale = oppositeLocale(locale);

  async function switchLanguage() {
    setSwitching(true);
    const nextPath = `/${nextLocale}/dashboard/preferences`;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: nextLocale })
    });
    router.push(nextPath);
    router.refresh();
  }

  const identity = user.email ?? user.phone ?? "";

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* Header */}
      <section className="border-b k-hairline pb-10 pt-8">
        <div className="k-grid">
          <motion.p className="k-label col-span-4 mb-4 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.1, "fadeIn")}>
            Account preferences
          </motion.p>
          <motion.h1 className="k-section-title col-span-4 md:col-span-8 lg:col-span-6" {...anim(0.15, "slideRight")}>
            Preferences
          </motion.h1>
        </div>
      </section>

      {/* Account info */}
      <section className="border-b k-hairline">
        <div className="k-grid py-8">
          <motion.p className="k-label col-span-4 mb-6 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.2, "slideLeft")}>
            Account
          </motion.p>

          {[
            { label: "Display name", value: user.name },
            { label: "Identity", value: identity || "—" },
            { label: "Login method", value: user.provider === "google" ? "Google OAuth" : "WhatsApp OTP" }
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              className="col-span-4 grid grid-cols-[1fr_auto] items-baseline border-b border-[var(--color-ink-faint)] py-5 last:border-b-0 md:col-span-8 lg:col-span-6"
              {...anim(0.26 + i * 0.07)}
            >
              <p className="k-label text-[var(--color-ink-soft)]">{label}</p>
              <p className="text-xl font-black uppercase leading-none">{value}</p>
            </motion.div>
          ))}

          {user.provider === "google" && (
            <motion.div
              className="col-span-4 mt-2 flex items-center gap-2 md:col-span-8 lg:col-span-6"
              {...anim(0.5, "fadeIn")}
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-green)]">
                <Check size={11} className="text-white" />
              </span>
              <p className="k-label text-[var(--color-ink-soft)]">Connected via Google Cloud OAuth — verified</p>
            </motion.div>
          )}

          {user.provider === "whatsapp" && (
            <motion.div
              className="col-span-4 mt-2 flex items-center gap-2 md:col-span-8 lg:col-span-6"
              {...anim(0.5, "fadeIn")}
            >
              <MessageCircle size={14} className="text-[var(--color-green)]" />
              <p className="k-label text-[var(--color-ink-soft)]">Verified via Twilio WhatsApp OTP</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Language */}
      <section className="border-b k-hairline">
        <div className="k-grid py-8">
          <motion.p className="k-label col-span-4 mb-6 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.3, "slideLeft")}>
            Language
          </motion.p>

          {(["tr", "en"] as Locale[]).map((loc, i) => {
            const isActive = locale === loc;
            return (
              <motion.div
                key={loc}
                className="col-span-4 md:col-span-4 lg:col-span-3"
                {...anim(0.36 + i * 0.06)}
              >
                <button
                  type="button"
                  disabled={isActive || switching}
                  onClick={isActive ? undefined : switchLanguage}
                  className={`w-full border p-5 text-left transition-colors ${
                    isActive
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border-[var(--color-ink-faint)] hover:border-[var(--color-ink)]"
                  } disabled:cursor-default`}
                >
                  <p className="text-2xl font-black uppercase leading-none">{loc === "tr" ? "Türkçe" : "English"}</p>
                  <p className="k-label mt-2 opacity-60">{loc.toUpperCase()}</p>
                  {isActive && (
                    <span className="mt-3 inline-flex items-center gap-1">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime" />
                      <span className="k-label text-lime">Active</span>
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Security / MFA */}
      <section className="border-b k-hairline">
        <div className="k-grid py-8">
          <motion.p className="k-label col-span-4 mb-6 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.35, "slideLeft")}>
            Security
          </motion.p>
          <motion.div className="col-span-4 md:col-span-12" {...anim(0.4)}>
            <MfaSection userId={user.id} mfaEnabled={mfaEnabled} />
          </motion.div>
        </div>
      </section>

      {/* Notifications placeholder */}
      <section>
        <div className="k-grid py-8">
          <motion.p className="k-label col-span-4 mb-6 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.4, "slideLeft")}>
            Notifications
          </motion.p>
          {[
            { label: "Weekly try-on report", hint: "Email summary every Monday" },
            { label: "Return impact alerts", hint: "When return rate changes ±5%" },
            { label: "Product sync errors", hint: "When IKAS sync fails" }
          ].map(({ label, hint }, i) => (
            <motion.div
              key={label}
              className="col-span-4 grid grid-cols-[1fr_auto] items-center border-b border-[var(--color-ink-faint)] py-5 last:border-b-0 md:col-span-8 lg:col-span-6"
              {...anim(0.46 + i * 0.06)}
            >
              <div>
                <p className="text-lg font-black uppercase leading-none">{label}</p>
                <p className="k-label mt-1 text-[var(--color-ink-soft)]">{hint}</p>
              </div>
              <span className="k-label text-[var(--color-ink-faint)]">Coming soon</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

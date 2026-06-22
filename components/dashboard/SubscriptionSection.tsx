"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { makeAnim } from "@/components/dashboard/anim";

export function SubscriptionSection() {
  const reduced = useReducedMotion();
  const anim = makeAnim(reduced);

  const included = [
    "IKAS app integration",
    "Up to 5 active products",
    "3D fitting cabin",
    "Fit profile builder",
    "Return impact dashboard",
    "Turkish + English support"
  ];

  const upcoming = [
    "Unlimited products",
    "Shopify integration",
    "Custom branding",
    "Advanced analytics",
    "Priority support",
    "API access"
  ];

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* Header */}
      <section className="border-b k-hairline pb-10 pt-8">
        <div className="k-grid">
          <motion.p className="k-label col-span-4 mb-4 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.1, "fadeIn")}>
            Billing & plan
          </motion.p>
          <motion.h1 className="k-section-title col-span-4 md:col-span-8 lg:col-span-6" {...anim(0.15, "slideRight")}>
            Subscription
          </motion.h1>
        </div>
      </section>

      {/* Current plan */}
      <section className="border-b k-hairline">
        <div className="k-grid py-8">
          <motion.div
            className="col-span-4 border border-[var(--color-ink)] p-6 md:col-span-5 lg:col-span-4"
            {...anim(0.2, "slideLeft")}
          >
            <p className="k-label text-[var(--color-ink-soft)]">Current plan</p>
            <p
              className="mt-4 font-black uppercase text-[var(--color-ink)]"
              style={{ fontSize: "clamp(3rem, 8vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.9 }}
            >
              Pilot
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-lime" aria-hidden />
              <span className="k-label text-lime">Active · Free during pilot</span>
            </div>
            <p className="k-body mt-4 text-sm">
              Early access period — no payment required. Pricing will be announced before general availability.
            </p>
          </motion.div>

          <motion.div
            className="col-span-4 mt-4 md:col-span-3 md:mt-0 lg:col-span-3"
            {...anim(0.28, "fadeIn")}
          >
            <p className="k-label mb-4 text-[var(--color-ink-soft)]">Included now</p>
            <ul className="space-y-3">
              {included.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={14} className="shrink-0 text-[var(--color-green)]" aria-hidden />
                  <span className="text-sm font-black uppercase leading-tight">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Usage */}
      <section className="border-b k-hairline">
        <div className="k-grid py-8">
          <motion.p className="k-label col-span-4 mb-6 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.3, "slideLeft")}>
            Usage this period
          </motion.p>
          {[
            { label: "Try-ons", value: "1,248", limit: "Unlimited during pilot" },
            { label: "Active products", value: "2 / 5", limit: "5 product limit" },
            { label: "Profile completions", value: "887", limit: "Unlimited during pilot" }
          ].map(({ label, value, limit }, i) => (
            <motion.div
              key={label}
              className="col-span-4 grid grid-cols-[1fr_auto] items-baseline border-b border-[var(--color-ink-faint)] py-5 last:border-b-0 md:col-span-4 lg:col-span-4"
              {...anim(0.36 + i * 0.07)}
            >
              <div>
                <p className="k-label text-[var(--color-ink-soft)]">{label}</p>
                <p className="k-label mt-1 text-[var(--color-ink-faint)]">{limit}</p>
              </div>
              <p className="text-3xl font-black uppercase leading-none md:text-4xl">{value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming paid plan */}
      <section className="bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="k-grid py-10">
          <motion.div className="col-span-4 md:col-span-5 lg:col-span-5" {...anim(0.4)}>
            <p className="k-label mb-4 text-white/50">Coming soon</p>
            <p
              className="font-black uppercase text-white"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "-0.04em", lineHeight: 0.9 }}
            >
              Pro Plan
            </p>
            <p className="k-body mt-4 text-sm text-white/60">
              Pricing will be announced to pilot merchants first. You will receive early-access pricing.
            </p>
            <a
              href="mailto:hello@karyamoni.com"
              className="k-button mt-6 inline-flex items-center gap-2 border-white/30 text-white hover:bg-white hover:text-[var(--color-ink)]"
            >
              Get notified
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </motion.div>

          <motion.div className="col-span-4 mt-8 md:col-span-3 md:mt-0 lg:col-span-4 lg:mt-0" {...anim(0.48, "slideRight")}>
            <p className="k-label mb-4 text-white/50">What's included</p>
            <ul className="space-y-3">
              {upcoming.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
                  <span className="text-sm font-black uppercase leading-tight text-white/70">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

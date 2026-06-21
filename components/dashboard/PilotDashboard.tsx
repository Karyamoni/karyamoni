"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, CircleDashed, LogOut, Store } from "lucide-react";
import type { CurrentUser } from "@/lib/session";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";

type Props = {
  locale: Locale;
  content: SiteContent;
  user: CurrentUser;
};

const products = [
  { name: "Ribbed Texture Blazer", status: "Live", score: "88%" },
  { name: "Oversized Cotton Shirt", status: "Ready", score: "94%" },
  { name: "Straight Fit Denim", status: "Missing data", score: "42%" },
  { name: "Longline Coat", status: "Unsupported", score: "0%" }
];

const checklist = [
  { step: "01", label: "Install app", done: true },
  { step: "02", label: "Choose languages", done: true },
  { step: "03", label: "Activate 2 products", done: true },
  { step: "04", label: "Review demo analytics", done: false }
];

const installStatus = [
  { label: "IKAS app installed", done: true },
  { label: "Permissions approved", done: true },
  { label: "Product sync running", done: true },
  { label: "Return data connected", done: false }
];

const impactSignals = [
  { label: "Size returns baseline", value: "23%" },
  { label: "Pilot target", value: "18%" },
  { label: "Confidence", value: "Medium" }
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function PilotDashboard({ locale, content, user }: Props) {
  const reducedMotion = useReducedMotion();

  const anim = (
    delay: number,
    type: "fadeUp" | "fadeIn" | "slideX" | "scale" = "fadeUp"
  ) => {
    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      };
    }
    if (type === "fadeIn") {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.7, ease: EASE, delay }
      };
    }
    if (type === "slideX") {
      return {
        initial: { opacity: 0, x: -32 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: EASE, delay }
      };
    }
    if (type === "scale") {
      return {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 1.1, ease: EASE, delay }
      };
    }
    return {
      initial: { opacity: 0, y: 32 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.9, ease: EASE, delay }
    };
  };

  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* ── IKAS Rail ─────────────────────────────────────── */}
      <motion.div
        className="sticky top-16 z-40 bg-[var(--color-ink)] text-[var(--color-paper)]"
        initial={{ opacity: 0, y: reducedMotion ? 0 : -56 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0 }}
      >
        <div className="k-grid items-center py-3">
          <div className="col-span-3 flex items-center gap-3 md:col-span-5 lg:col-span-7">
            <Store size={15} aria-hidden className="shrink-0 opacity-60" />
            <span className="k-label hidden text-white/60 sm:inline">IKAS</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-lime" aria-hidden />
              <span className="k-label text-lime">Connected</span>
            </span>
            <span className="k-label hidden text-white/25 md:inline">·</span>
            <span className="k-label hidden text-white/50 md:inline">4/4 permissions</span>
            <span className="k-label hidden text-white/25 lg:inline">·</span>
            <span className="k-label hidden text-white/40 lg:inline">Last sync 2 min ago</span>
          </div>
          <div className="col-span-1 flex justify-end md:col-span-3 lg:col-span-5">
            <a
              href="https://ikas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="k-label flex items-center gap-1 text-white/40 transition-colors duration-300 hover:text-white"
            >
              <span className="hidden md:inline">Open IKAS</span>
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Hero Metric ────────────────────────────────────── */}
      <section className="border-b k-hairline pb-14 pt-12">
        <div className="k-grid">
          {/* Line A: session label */}
          <motion.p
            className="k-label col-span-4 mb-6 text-[var(--color-ink-soft)] md:col-span-12"
            {...anim(0.1, "fadeIn")}
          >
            {user.provider} · pilot session
          </motion.p>

          {/* Monumental −18% */}
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <motion.p className="k-label mb-3 text-[var(--color-ink-soft)]" {...anim(0.15, "fadeIn")}>
              {content.dashboard.impact}
            </motion.p>
            <motion.div {...anim(0.18, "scale")}>
              <span
                className="block font-black uppercase text-[var(--color-ink)]"
                style={{
                  fontSize: "clamp(5.5rem, 22vw, 20rem)",
                  letterSpacing: "-0.06em",
                  lineHeight: 0.84
                }}
              >
                −18%
              </span>
            </motion.div>
            <motion.p className="k-body mt-5 max-w-xs text-[15px] leading-relaxed" {...anim(0.38, "fadeIn")}>
              Return rate reduction since pilot — baseline was 23%
            </motion.p>
          </div>

          {/* Line C: flanking metric + logout */}
          <motion.div
            className="col-span-4 mt-8 flex flex-col justify-between md:col-span-4 md:mt-0 lg:col-span-5 lg:items-end lg:text-right"
            {...anim(0.3)}
          >
            <div>
              <p className="k-label mb-2 text-[var(--color-ink-soft)]">{content.dashboard.metrics}</p>
              <span
                className="block font-black uppercase text-[var(--color-ink)]"
                style={{ fontSize: "clamp(3rem, 9vw, 7rem)", letterSpacing: "-0.04em", lineHeight: 0.9 }}
              >
                1,248
              </span>
              <p className="k-label mt-2 text-[var(--color-ink-soft)]">total try-ons</p>
            </div>
            <Link
              href={`/api/auth/logout?locale=${locale}`}
              className="k-link mt-8 inline-flex items-center self-start lg:self-end"
            >
              <LogOut className="mr-2" size={13} aria-hidden />
              Sign out
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Supporting metrics strip ───────────────────────── */}
      <section className="border-b k-hairline">
        <div className="k-grid py-0">
          {[
            { label: "Profile completion", value: "71%", delay: 0.42 },
            { label: "Add-to-cart lift", value: "+12%", delay: 0.48 },
            { label: "Size returns baseline", value: "23%", delay: 0.54 },
            { label: "Pilot target", value: "18%", delay: 0.6 }
          ].map(({ label, value, delay }) => (
            <motion.div
              key={label}
              className="col-span-2 border-r border-[var(--color-ink-faint)] py-6 pr-4 last:border-r-0 md:col-span-2 lg:col-span-3"
              {...anim(delay)}
            >
              <p className="k-label text-[var(--color-ink-soft)]">{label}</p>
              <p className="mt-3 text-3xl font-black uppercase leading-none md:text-4xl">{value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Setup Checklist ────────────────────────────────── */}
      <section className="border-b k-hairline bg-[var(--color-paper)]">
        <div className="k-grid pb-12 pt-10">
          <motion.p
            className="k-label col-span-4 mb-8 text-[var(--color-ink-soft)] md:col-span-8 lg:col-span-12"
            {...anim(0.42, "fadeIn")}
          >
            {content.dashboard.checklist}
          </motion.p>

          {checklist.map(({ step, label, done }, i) => (
            <motion.div
              key={step}
              className="col-span-4 grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-[var(--color-ink-faint)] py-5 last:border-b-0 md:col-span-8 lg:col-span-12"
              {...anim(0.5 + i * 0.08)}
            >
              {/* Line A */}
              <span className="k-mono-label text-[var(--color-ink-soft)]">{step}</span>
              {/* Line B */}
              <p className="text-xl font-black uppercase leading-none md:text-2xl">{label}</p>
              {/* Line C */}
              <span
                className="k-label"
                style={{ color: done ? "#c7ff47" : "#ff6b4a" }}
              >
                {done ? "Done" : "Next"}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Product Readiness — mosaic balance ─────────────── */}
      <section className="border-b k-hairline bg-mist">
        <div className="k-grid pb-12 pt-10">
          <motion.div
            className="col-span-4 mb-8 md:col-span-5 lg:col-span-6"
            {...anim(0.7, "fadeIn")}
          >
            <p className="k-label mb-2 text-[var(--color-ink-soft)]">{content.dashboard.products}</p>
            <p className="text-2xl font-black uppercase leading-tight md:text-3xl">Product readiness</p>
          </motion.div>

          <div className="col-span-4 border-t border-[var(--color-ink-faint)] md:col-span-8 lg:col-span-12">
            {products.map((product, i) => (
              <MosaicRow
                key={product.name}
                product={product}
                delay={0.76 + i * 0.06}
                reduced={reducedMotion ?? false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Install Status + Impact — cobalt ───────────────── */}
      <section className="bg-[var(--color-cobalt)] text-[var(--color-paper)]">
        <div className="k-grid pb-14 pt-10">
          {/* Install status */}
          <motion.div className="col-span-4 lg:col-span-5" {...anim(0.9)}>
            <p className="k-label mb-8 text-white/50">{content.dashboard.installStatus}</p>
            {installStatus.map(({ label, done }) => (
              <div
                key={label}
                className="flex items-center gap-3 border-b border-white/10 py-4 last:border-b-0"
              >
                {done
                  ? <CheckCircle2 size={15} style={{ color: "#c7ff47" }} aria-hidden />
                  : <CircleDashed size={15} style={{ color: "#ff6b4a" }} aria-hidden />
                }
                <p className="text-lg font-black uppercase leading-none">{label}</p>
              </div>
            ))}
          </motion.div>

          <div className="hidden lg:col-span-2 lg:block" />

          {/* Impact signals */}
          <motion.div className="col-span-4 mt-10 lg:col-span-5 lg:mt-0" {...anim(1.0)}>
            <p className="k-label mb-8 text-white/50">Pilot impact signal</p>
            {impactSignals.map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-[1fr_auto] items-baseline border-b border-white/10 py-4 last:border-b-0"
              >
                <p className="k-label text-white/50">{label}</p>
                <p className="text-3xl font-black uppercase leading-none">{value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

type ProductRowProps = {
  product: { name: string; status: string; score: string };
  delay: number;
  reduced: boolean;
};

function MosaicRow({ product, delay, reduced }: ProductRowProps) {
  const isLive = product.status === "Live";
  const isMissing = product.status === "Missing data";
  const isUnsupported = product.status === "Unsupported";

  const rowPy = isLive ? "py-8" : isMissing ? "py-4" : isUnsupported ? "py-3" : "py-6";

  const nameSize = isLive
    ? "text-4xl md:text-5xl lg:text-6xl"
    : isMissing
    ? "text-xl md:text-2xl lg:text-3xl"
    : isUnsupported
    ? "text-lg md:text-xl"
    : "text-3xl md:text-4xl lg:text-5xl";

  const scoreSize = isLive
    ? "text-4xl md:text-5xl lg:text-6xl"
    : isMissing
    ? "text-2xl md:text-3xl"
    : isUnsupported
    ? "text-xl md:text-2xl"
    : "text-3xl md:text-4xl lg:text-5xl";

  const accentBorder = isLive
    ? "border-l-4 border-l-lime pl-4"
    : isMissing
    ? "border-l-4 border-l-coral pl-4"
    : "pl-0";

  const scoreColor = isLive ? "text-lime" : isMissing ? "text-coral" : "";
  const dimClass = isUnsupported ? "opacity-30" : "";

  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : {
        initial: { opacity: 0, x: -32 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: EASE, delay }
      };

  return (
    <motion.div
      className={`border-b border-[var(--color-ink-faint)] ${rowPy} ${accentBorder} ${dimClass} last:border-b-0`}
      {...motionProps}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_180px_120px]">
        <div>
          <p className={`${nameSize} font-black uppercase leading-none`}>{product.name}</p>
          {isMissing && (
            <p className="k-label mt-1 text-coral">Action required</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span
              className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-lime"
              aria-hidden
            />
          )}
          <span className="k-label text-[var(--color-ink-soft)]">{product.status}</span>
        </div>
        <p className={`text-right ${scoreSize} ${scoreColor} font-black uppercase leading-none`}>
          {product.score}
        </p>
      </div>
    </motion.div>
  );
}

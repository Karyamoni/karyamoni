"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Store } from "lucide-react";
import { makeAnim, EASE } from "@/components/dashboard/anim";
import type { CurrentUser } from "@/lib/session";
import type { SiteContent } from "@/lib/content";

type Props = {
  content: SiteContent;
  user: CurrentUser;
};

const METRICS = [
  { label: "Profile completion", value: "71%", delay: 0.42 },
  { label: "Add-to-cart lift", value: "+12%", delay: 0.48 },
  { label: "Size returns baseline", value: "23%", delay: 0.54 },
  { label: "Pilot target", value: "18%", delay: 0.6 }
];

export function OverviewSection({ content, user }: Props) {
  const reduced = useReducedMotion();
  const anim = makeAnim(reduced);
  const identity = user.email ?? user.phone ?? "";

  return (
    <div className="bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* IKAS Rail */}
      <motion.div
        className="sticky top-14 z-30 bg-[var(--color-ink)] text-[var(--color-paper)]"
        initial={{ opacity: 0, y: reduced ? 0 : -40 }}
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

      {/* Hero Metric */}
      <section className="border-b k-hairline pb-14 pt-8">
        <div className="k-grid">
          <motion.p
            className="k-label col-span-4 mb-6 text-[var(--color-ink-soft)] md:col-span-12"
            {...anim(0.1, "fadeIn")}
          >
            Pilot · return impact
          </motion.p>

          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <motion.p className="k-label mb-3 text-[var(--color-ink-soft)]" {...anim(0.15, "slideLeft")}>
              {content.dashboard.impact}
            </motion.p>
            <motion.div {...anim(0.18, "slideRight")}>
              <span
                className="block font-black uppercase text-[var(--color-ink)]"
                style={{ fontSize: "clamp(5.5rem, 22vw, 20rem)", letterSpacing: "-0.06em", lineHeight: 0.84 }}
              >
                −18%
              </span>
            </motion.div>
            <motion.p className="k-body mt-5 max-w-xs text-[15px] leading-relaxed" {...anim(0.42, "slideLeft")}>
              Return rate reduction since pilot — baseline was 23%
            </motion.p>
          </div>

          <motion.div
            className="col-span-4 mt-8 flex flex-col justify-between md:col-span-4 md:mt-0 lg:col-span-5 lg:items-end lg:text-right"
            {...anim(0.28, "slideRight")}
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
            {identity && (
              <p className="k-label mt-6 text-[var(--color-ink-soft)]">{identity}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="border-b k-hairline">
        <div className="k-grid py-0">
          {METRICS.map(({ label, value, delay }, i) => (
            <div
              key={label}
              className="col-span-2 border-r border-[var(--color-ink-faint)] py-6 pr-4 last:border-r-0 md:col-span-2 lg:col-span-3"
            >
              <motion.p
                className="k-label text-[var(--color-ink-soft)]"
                {...anim(delay, i % 2 === 0 ? "slideLeft" : "fadeIn")}
              >
                {label}
              </motion.p>
              <motion.p
                className="mt-3 text-3xl font-black uppercase leading-none md:text-4xl"
                {...anim(delay + 0.06, "slideRight")}
              >
                {value}
              </motion.p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

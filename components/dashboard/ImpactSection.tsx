"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { makeAnim } from "@/components/dashboard/anim";
import type { SiteContent } from "@/lib/content";

type Props = { content: SiteContent };

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

export function ImpactSection({ content }: Props) {
  const reduced = useReducedMotion();
  const anim = makeAnim(reduced);

  return (
    <div className="min-h-screen bg-[var(--color-cobalt)] text-[var(--color-paper)]">
      <section className="k-grid pb-14 pt-10">
        <motion.div className="col-span-4 lg:col-span-5" {...anim(0.1)}>
          <p className="k-label mb-8 text-white/50">{content.dashboard.installStatus}</p>
          {installStatus.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-3 border-b border-white/10 py-4 last:border-b-0">
              {done
                ? <CheckCircle2 size={15} style={{ color: "#c7ff47" }} aria-hidden />
                : <CircleDashed size={15} style={{ color: "#ff6b4a" }} aria-hidden />
              }
              <p className="text-lg font-black uppercase leading-none">{label}</p>
            </div>
          ))}
        </motion.div>

        <div className="hidden lg:col-span-2 lg:block" />

        <div className="col-span-4 mt-10 lg:col-span-5 lg:mt-0">
          <motion.p className="k-label mb-8 text-white/50" {...anim(0.2, "slideLeft")}>
            Pilot impact signal
          </motion.p>
          {impactSignals.map(({ label, value }, i) => (
            <div key={label} className="grid grid-cols-[1fr_auto] items-baseline border-b border-white/10 py-4 last:border-b-0">
              <motion.p className="k-label text-white/50" {...anim(0.28 + i * 0.07, "slideLeft")}>
                {label}
              </motion.p>
              <motion.p
                className="text-3xl font-black uppercase leading-none"
                {...anim(0.32 + i * 0.07, "slideRight")}
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

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { makeAnim } from "@/components/dashboard/anim";
import type { SiteContent } from "@/lib/content";

type Props = { content: SiteContent };

const checklist = [
  { step: "01", label: "Install app", done: true },
  { step: "02", label: "Choose languages", done: true },
  { step: "03", label: "Activate 2 products", done: true },
  { step: "04", label: "Review demo analytics", done: false }
];

export function SetupSection({ content }: Props) {
  const reduced = useReducedMotion();
  const anim = makeAnim(reduced);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <section className="k-grid pb-12 pt-10">
        <motion.p
          className="k-label col-span-4 mb-8 text-[var(--color-ink-soft)] md:col-span-8 lg:col-span-12"
          {...anim(0.1, "fadeIn")}
        >
          {content.dashboard.checklist}
        </motion.p>

        {checklist.map(({ step, label, done }, i) => {
          const d = 0.18 + i * 0.09;
          return (
            <div
              key={step}
              className="col-span-4 grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-[var(--color-ink-faint)] py-5 last:border-b-0 md:col-span-8 lg:col-span-12"
            >
              <motion.span className="k-mono-label text-[var(--color-ink-soft)]" {...anim(d, "slideLeft")}>
                {step}
              </motion.span>
              <motion.p className="text-xl font-black uppercase leading-none md:text-2xl" {...anim(d + 0.04, "slideLeft")}>
                {label}
              </motion.p>
              <motion.span
                className="k-label"
                style={{ color: done ? "#c7ff47" : "#ff6b4a" }}
                {...anim(d + 0.08, "slideRight")}
              >
                {done ? "Done" : "Next"}
              </motion.span>
            </div>
          );
        })}
      </section>
    </div>
  );
}

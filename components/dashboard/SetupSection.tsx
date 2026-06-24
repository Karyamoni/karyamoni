"use client";

import { motion, useReducedMotion } from "framer-motion";
import { makeAnim } from "@/components/dashboard/anim";
import { IkasConnectForm } from "@/components/dashboard/IkasConnectForm";
import type { SiteContent } from "@/lib/content";

type Store = { name: string; installStatus: string } | null;

type Props = {
  content: SiteContent;
  store: Store;
};

export function SetupSection({ content, store }: Props) {
  const reduced = useReducedMotion();
  const anim = makeAnim(reduced);
  const ikasConnected = store?.installStatus === "connected";

  const checklist = [
    { step: "01", label: "Create account", done: true },
    { step: "02", label: "Connect ikas store", done: ikasConnected, ikas: true },
    { step: "03", label: "Choose languages", done: false },
    { step: "04", label: "Activate products", done: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <section className="k-grid pb-12 pt-10">
        <motion.p
          className="k-label col-span-4 mb-8 text-[var(--color-ink-soft)] md:col-span-8 lg:col-span-12"
          {...anim(0.1, "fadeIn")}
        >
          {content.dashboard.checklist}
        </motion.p>

        {checklist.map(({ step, label, done, ikas }, i) => {
          const d = 0.18 + i * 0.09;
          return (
            <div
              key={step}
              className="col-span-4 border-b border-[var(--color-ink-faint)] py-6 last:border-b-0 md:col-span-8 lg:col-span-12"
            >
              <div className="grid grid-cols-[2rem_1fr_auto] items-start gap-4">
                <motion.span
                  className="k-mono-label pt-1 text-[var(--color-ink-soft)]"
                  {...anim(d, "slideLeft")}
                >
                  {step}
                </motion.span>

                <div>
                  <motion.p
                    className="text-xl font-black uppercase leading-none md:text-2xl"
                    {...anim(d + 0.04, "slideLeft")}
                  >
                    {label}
                  </motion.p>

                  {ikas && !done && (
                    <motion.div {...anim(d + 0.1, "fadeIn")}>
                      <IkasConnectForm />
                    </motion.div>
                  )}

                  {ikas && done && store && (
                    <motion.p
                      className="k-label mt-2 text-[var(--color-ink-soft)]"
                      {...anim(d + 0.08, "fadeIn")}
                    >
                      {store.name}.myikas.com
                    </motion.p>
                  )}
                </div>

                <motion.span
                  className="k-label pt-1"
                  style={{ color: done ? "#c7ff47" : "#ff6b4a" }}
                  {...anim(d + 0.08, "slideRight")}
                >
                  {done ? "Done" : "Next"}
                </motion.span>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

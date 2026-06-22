"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, MessageCircle, ScrollText } from "lucide-react";
import { makeAnim } from "@/components/dashboard/anim";
import type { Locale } from "@/lib/i18n";

type Props = { locale: Locale };

const FAQ = [
  {
    q: "Why is my product showing 'Missing data'?",
    a: "Karyamoni needs size chart data and at least one product image to build a fit profile. Go to Products → select the product → upload missing size information."
  },
  {
    q: "How long does IKAS product sync take?",
    a: "Initial sync runs within 5 minutes of installation. After that, changes in IKAS sync automatically every 15 minutes. You can trigger a manual sync from the IKAS panel."
  },
  {
    q: "Why is my return rate reduction showing −18%?",
    a: "This is pilot benchmark data based on early cohort testing. Your store's actual metric will appear once you have at least 50 completed try-on sessions."
  },
  {
    q: "Can shoppers use Karyamoni on mobile?",
    a: "Yes. The fitting cabin is fully responsive and optimised for mobile. Profile input and 3D preview adapt to smaller screens."
  },
  {
    q: "How do I activate a product for try-on?",
    a: "Go to Products in this dashboard. Click any product with a 'Ready' status — a try-on button will appear on its IKAS product page within 15 minutes."
  },
  {
    q: "Is shopper body data stored securely?",
    a: "Fit profile data is stored with explicit shopper consent, encrypted at rest, and never shared with third parties. Compliant with KVKK requirements."
  }
];

export function HelpSection({ locale }: Props) {
  const reduced = useReducedMotion();
  const anim = makeAnim(reduced);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* Header */}
      <section className="border-b k-hairline pb-10 pt-8">
        <div className="k-grid">
          <motion.p className="k-label col-span-4 mb-4 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.1, "fadeIn")}>
            Support & documentation
          </motion.p>
          <motion.h1 className="k-section-title col-span-4 md:col-span-8 lg:col-span-6" {...anim(0.15, "slideRight")}>
            Help
          </motion.h1>
        </div>
      </section>

      {/* Quick links */}
      <section className="border-b k-hairline">
        <div className="k-grid py-8">
          <motion.p className="k-label col-span-4 mb-6 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.2, "slideLeft")}>
            Quick links
          </motion.p>

          {[
            {
              icon: <ScrollText size={18} aria-hidden />,
              label: "Full documentation",
              hint: "Installation, activation, and troubleshooting",
              href: `/${locale}/docs`
            },
            {
              icon: <MessageCircle size={18} aria-hidden />,
              label: "WhatsApp support",
              hint: "Response within 1 business day",
              href: "https://wa.me/905550000000"
            },
            {
              icon: <ArrowUpRight size={18} aria-hidden />,
              label: "IKAS app panel",
              hint: "Manage permissions and product sync",
              href: "https://ikas.com"
            }
          ].map(({ icon, label, hint, href }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="col-span-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 border border-[var(--color-ink-faint)] p-5 transition-colors hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] md:col-span-4 lg:col-span-4"
              {...anim(0.26 + i * 0.07)}
            >
              <span>{icon}</span>
              <div>
                <p className="text-lg font-black uppercase leading-none">{label}</p>
                <p className="k-label mt-1 opacity-50">{hint}</p>
              </div>
              <ArrowUpRight size={16} aria-hidden />
            </motion.a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="k-grid py-8">
          <motion.p className="k-label col-span-4 mb-6 text-[var(--color-ink-soft)] md:col-span-12" {...anim(0.34, "slideLeft")}>
            Frequently asked questions
          </motion.p>

          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            {FAQ.map(({ q, a }, i) => (
              <motion.div
                key={i}
                className="border-b border-[var(--color-ink-faint)] last:border-b-0"
                {...anim(0.4 + i * 0.05)}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-left"
                >
                  <p className="text-lg font-black uppercase leading-tight md:text-xl">{q}</p>
                  <motion.span
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} className="text-[var(--color-ink-soft)]" aria-hidden />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="k-body pb-5 text-[15px]">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact footer */}
      <section className="border-t k-hairline">
        <div className="k-grid py-8">
          <motion.div className="col-span-4 md:col-span-6" {...anim(0.5)}>
            <p className="k-label mb-3 text-[var(--color-ink-soft)]">Still need help?</p>
            <p className="k-body text-sm">
              Reach us directly — we respond to all pilot merchant questions personally.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="mailto:hello@karyamoni.com" className="k-button">
                Email us
              </a>
              <a href="https://wa.me/905550000000" target="_blank" rel="noopener noreferrer" className="k-button flex items-center gap-2">
                <MessageCircle size={14} aria-hidden />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { makeAnim, EASE } from "@/components/dashboard/anim";
import type { SiteContent } from "@/lib/content";

type Props = { content: SiteContent };

const products = [
  { name: "Ribbed Texture Blazer", status: "Live", score: "88%" },
  { name: "Oversized Cotton Shirt", status: "Ready", score: "94%" },
  { name: "Straight Fit Denim", status: "Missing data", score: "42%" },
  { name: "Longline Coat", status: "Unsupported", score: "0%" }
];

export function ProductsSection({ content }: Props) {
  const reduced = useReducedMotion();
  const anim = makeAnim(reduced);

  return (
    <div className="min-h-screen bg-mist text-[var(--color-ink)]">
      <section className="k-grid pb-12 pt-10">
        <div className="col-span-4 mb-8 md:col-span-5 lg:col-span-6">
          <motion.p className="k-label mb-2 text-[var(--color-ink-soft)]" {...anim(0.1, "slideLeft")}>
            {content.dashboard.products}
          </motion.p>
          <motion.p
            className="text-2xl font-black uppercase leading-tight md:text-3xl"
            {...anim(0.16, "slideRight")}
          >
            Product readiness
          </motion.p>
        </div>

        <div className="col-span-4 border-t border-[var(--color-ink-faint)] md:col-span-8 lg:col-span-12">
          {products.map((product, i) => (
            <MosaicRow
              key={product.name}
              product={product}
              delay={0.2 + i * 0.06}
              reduced={reduced ?? false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

type RowProps = { product: { name: string; status: string; score: string }; delay: number; reduced: boolean };

function MosaicRow({ product, delay, reduced }: RowProps) {
  const isLive = product.status === "Live";
  const isMissing = product.status === "Missing data";
  const isUnsupported = product.status === "Unsupported";

  const rowPy = isLive ? "py-8" : isMissing ? "py-4" : isUnsupported ? "py-3" : "py-6";
  const nameSize = isLive ? "text-4xl md:text-5xl lg:text-6xl" : isMissing ? "text-xl md:text-2xl lg:text-3xl" : isUnsupported ? "text-lg md:text-xl" : "text-3xl md:text-4xl lg:text-5xl";
  const scoreSize = isLive ? "text-4xl md:text-5xl lg:text-6xl" : isMissing ? "text-2xl md:text-3xl" : isUnsupported ? "text-xl md:text-2xl" : "text-3xl md:text-4xl lg:text-5xl";
  const accentBorder = isLive ? "border-l-4 border-l-lime pl-4" : isMissing ? "border-l-4 border-l-coral pl-4" : "pl-0";
  const scoreColor = isLive ? "text-lime" : isMissing ? "text-coral" : "";
  const dimClass = isUnsupported ? "opacity-30" : "";

  const nameMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, x: -48 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.85, ease: EASE, delay } };
  const scoreMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, x: 64 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.85, ease: EASE, delay: delay + 0.06 } };
  const statusMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, ease: EASE, delay: delay + 0.1 } };

  return (
    <div className={`border-b border-[var(--color-ink-faint)] ${rowPy} ${accentBorder} ${dimClass} last:border-b-0`}>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_180px_120px]">
        <motion.div {...nameMotion}>
          <p className={`${nameSize} font-black uppercase leading-none`}>{product.name}</p>
          {isMissing && <p className="k-label mt-1 text-coral">Action required</p>}
        </motion.div>
        <motion.div className="flex items-center gap-2" {...statusMotion}>
          {isLive && <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-lime" aria-hidden />}
          <span className="k-label text-[var(--color-ink-soft)]">{product.status}</span>
        </motion.div>
        <motion.p className={`text-right ${scoreSize} ${scoreColor} font-black uppercase leading-none`} {...scoreMotion}>
          {product.score}
        </motion.p>
      </div>
    </div>
  );
}

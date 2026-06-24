"use client";

import { motion, useReducedMotion } from "framer-motion";
import { makeAnim, EASE } from "@/components/dashboard/anim";
import type { SiteContent } from "@/lib/content";
import { SyncButton } from "@/components/dashboard/SyncButton";

type ProductState = "live" | "ready" | "missing";
type Product = { id: string; name: string; category: string; imageUrl: string | null; modelUrl?: string | null; state: ProductState; readinessScore: number; missingFields?: string[] };

type Props = {
  content: SiteContent;
  products: Product[];
  isConnected: boolean;
  ikasPluginUrl?: string | null;
};

export function ProductsSection({ content, products, isConnected, ikasPluginUrl }: Props) {
  const reduced = useReducedMotion();
  const anim = makeAnim(reduced);

  return (
    <div className="min-h-screen bg-mist text-[var(--color-ink)]">
      <section className="k-grid pb-12 pt-10">
        <div className="col-span-4 mb-8 flex items-start justify-between gap-4 md:col-span-5 lg:col-span-6">
          <div>
            <motion.p className="k-label mb-2 text-[var(--color-ink-soft)]" {...anim(0.1, "slideLeft")}>
              {content.dashboard.products}
            </motion.p>
            <motion.p className="text-2xl font-black uppercase leading-tight md:text-3xl" {...anim(0.16, "slideRight")}>
              Product readiness
            </motion.p>
          </div>
          {isConnected && (
            <motion.div className="pt-1" {...anim(0.2, "fadeIn")}>
              <SyncButton />
            </motion.div>
          )}
        </div>

        <div className="col-span-4 border-t border-[var(--color-ink-faint)] md:col-span-8 lg:col-span-12">
          {!isConnected ? (
            <motion.div className="py-12 text-center" {...anim(0.2, "fadeIn")}>
              <p className="text-xl font-black uppercase text-[var(--color-ink-soft)]">No store connected</p>
              <p className="k-label mt-3 text-[var(--color-ink-soft)]">
                Connect your ikas store from the{" "}
                <a href="setup" className="underline hover:text-[var(--color-ink)]">Setup page</a>
              </p>
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div className="py-12 text-center" {...anim(0.2, "fadeIn")}>
              <p className="text-xl font-black uppercase text-[var(--color-ink-soft)]">No products yet</p>
              <p className="k-label mt-3 text-[var(--color-ink-soft)]">
                Add products to your ikas store, then sync to see them here.
              </p>
              <div className="mt-6 flex justify-center">
                <SyncButton />
              </div>
            </motion.div>
          ) : (
            products.map((product, i) => (
              <MosaicRow key={product.id} product={product} delay={0.2 + i * 0.06} reduced={reduced ?? false} ikasPluginUrl={ikasPluginUrl} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

type RowProps = { product: Product; delay: number; reduced: boolean; ikasPluginUrl?: string | null };

function MosaicRow({ product, delay, reduced, ikasPluginUrl }: RowProps) {
  const isLive = product.state === "live";
  const isMissing = product.state === "missing";

  const rowPy = isLive ? "py-8" : isMissing ? "py-4" : "py-6";
  const nameSize = isLive ? "text-4xl md:text-5xl lg:text-6xl" : isMissing ? "text-xl md:text-2xl lg:text-3xl" : "text-3xl md:text-4xl lg:text-5xl";
  const scoreSize = isLive ? "text-4xl md:text-5xl lg:text-6xl" : isMissing ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl lg:text-5xl";
  const accentBorder = isLive ? "border-l-4 border-l-lime pl-4" : isMissing ? "border-l-4 border-l-coral pl-4" : "pl-0";
  const scoreColor = isLive ? "text-lime" : isMissing ? "text-coral" : "";

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
    <div className={`border-b border-[var(--color-ink-faint)] ${rowPy} ${accentBorder} last:border-b-0`}>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_180px_120px]">
        <motion.div className="flex items-center gap-4" {...nameMotion}>
          {product.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              width={isLive ? 64 : 48}
              height={isLive ? 64 : 48}
              className="shrink-0 rounded object-cover"
              style={{ border: "1px solid var(--color-ink-faint)" }}
            />
          )}
          <div>
            <p className="k-label mb-1 text-[var(--color-ink-soft)]">{product.category}</p>
            <p className={`${nameSize} font-black uppercase leading-none`}>{product.name}</p>
            {isMissing && product.missingFields && (
              <p className="k-label mt-1 text-coral">{product.missingFields.join(", ")}</p>
            )}
          </div>
        </motion.div>
        <motion.div className="flex flex-wrap items-center gap-2" {...statusMotion}>
          {isLive && <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-lime" aria-hidden />}
          <span className="k-label text-[var(--color-ink-soft)]">{product.state === "live" ? "Live" : product.state === "ready" ? "Ready" : "Missing data"}</span>
          {product.state !== "missing" && ikasPluginUrl && (
            <a
              href={`${ikasPluginUrl}/dashboard/try-on?productId=${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="k-label inline-flex items-center gap-1 rounded px-2 py-0.5 transition-colors"
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                background: isLive ? "rgba(190,255,92,0.12)" : "rgba(10,10,10,0.05)",
                color: isLive ? "var(--color-lime, #beff5c)" : "var(--color-ink-soft)",
                border: isLive ? "1px solid rgba(190,255,92,0.25)" : "1px solid var(--color-ink-faint)",
              }}
            >
              <span style={{ fontSize: "8px" }}>▶</span>
              {product.modelUrl ? "3D Cabinet" : "Try On"}
            </a>
          )}
        </motion.div>
        {product.readinessScore > 0 && (
          <motion.p className={`text-right ${scoreSize} ${scoreColor} font-black uppercase leading-none`} {...scoreMotion}>
            {product.readinessScore}%
          </motion.p>
        )}
      </div>
    </div>
  );
}

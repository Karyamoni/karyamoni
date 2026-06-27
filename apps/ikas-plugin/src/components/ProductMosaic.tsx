"use client";

import { motion } from "framer-motion";
import type { IkasProduct, ProductState } from "@/app/api/ikas/products/route";
import { SyncButton } from "@/components/SyncButton";

const SPAN_MAP: Record<ProductState, string> = {
  live: "1 / 9",
  ready: "1 / 7",
  missing: "1 / 5",
};

const STATE_LABELS: Record<ProductState, string> = {
  live: "Live",
  ready: "Ready",
  missing: "Missing Data",
};

function ProductCard({ product, delay }: { product: IkasProduct; delay: number }) {
  const isLive = product.state === "live";
  const isMissing = product.state === "missing";
  const canTryOn = product.state !== "missing";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        gridColumn: SPAN_MAP[product.state],
        padding: isLive ? "28px 32px" : isMissing ? "20px 24px" : "16px 20px",
        border: "1px solid var(--ink-10)",
        borderRadius: "4px",
        background: isLive ? "var(--ink)" : "var(--paper)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: isLive ? "12px" : "8px" }}>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            width={isLive ? 72 : 48}
            height={isLive ? 72 : 48}
            style={{
              objectFit: "cover",
              borderRadius: "2px",
              flexShrink: 0,
              opacity: isLive ? 1 : 0.8,
              border: isLive ? "none" : "1px solid var(--ink-10)",
            }}
          />
        )}
        <p
          className="type-caption"
          style={{ color: isLive ? "rgba(250,250,249,0.5)" : "var(--ink-60)", paddingTop: "2px" }}
        >
          {product.category}
        </p>
      </div>

      <h3
        style={{
          fontSize: isLive ? "clamp(24px, 3.5vw, 42px)" : product.state === "ready" ? "clamp(18px, 2.5vw, 28px)" : "clamp(14px, 1.8vw, 18px)",
          fontWeight: 500,
          letterSpacing: isLive ? "-0.03em" : "-0.01em",
          lineHeight: 1.1,
          color: isLive ? "var(--paper)" : "var(--ink)",
          marginBottom: "12px",
        }}
      >
        {product.name}
      </h3>

      {product.readinessScore > 0 && (
        <p
          style={{
            fontSize: isLive ? "clamp(56px, 7vw, 96px)" : "clamp(32px, 4vw, 52px)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: isLive ? "var(--lime)" : "var(--ink)",
            marginBottom: "8px",
          }}
        >
          {product.readinessScore}
          <span style={{ fontSize: "0.3em", verticalAlign: "super", color: isLive ? "rgba(190,255,92,0.6)" : "var(--ink-40)" }}>
            %
          </span>
        </p>
      )}

      {isMissing && product.missingFields && (
        <ul style={{ listStyle: "none", marginTop: "8px" }}>
          {product.missingFields.map((f) => (
            <li key={f} className="type-caption" style={{ fontSize: "10px", color: "var(--coral)", paddingBlock: "2px", borderBottom: "1px solid rgba(255,107,91,0.15)" }}>
              ↳ {f}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: isLive ? "20px" : "12px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: "2px",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            ...(isLive && { background: "var(--lime)", color: "var(--ink)" }),
            ...(product.state === "ready" && { border: "1px solid var(--lime)", color: "var(--ink)" }),
            ...(isMissing && { border: "1px solid var(--coral)", color: "var(--coral)" }),
          }}
        >
          {STATE_LABELS[product.state]}
        </span>

        {canTryOn && (
          <a
            href={`/dashboard/try-on?productId=${product.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "2px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              background: isLive ? "rgba(190,255,92,0.15)" : "rgba(10,10,10,0.06)",
              color: isLive ? "var(--lime)" : "var(--ink-60)",
              border: isLive ? "1px solid rgba(190,255,92,0.3)" : "1px solid var(--ink-10)",
              transition: "background 0.15s ease",
            }}
          >
            <span style={{ fontSize: "9px" }}>▶</span>
            Try On
          </a>
        )}
        <a
          href="/dashboard/size-charts"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 10px",
            borderRadius: "2px",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            background: "transparent",
            color: "var(--ink-40)",
            border: "1px solid var(--ink-10)",
            transition: "color 0.15s ease",
          }}
        >
          Size Charts
        </a>
      </div>
    </motion.article>
  );
}

type Props = { products: IkasProduct[]; storeName: string | null };

export function ProductMosaic({ products, storeName }: Props) {
  const adminUrl = storeName
    ? `https://${storeName}.myikas.com/admin/product`
    : "https://app.myikas.com";

  if (products.length === 0) {
    return (
      <section style={{ paddingBlock: "48px 64px" }}>
        <p className="type-caption" style={{ marginBottom: "8px" }}>Products</p>
        <p
          style={{
            fontSize: "clamp(36px, 5vw, 72px)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
          }}
        >
          No products
          <br />
          <span style={{ color: "var(--ink-40)" }}>yet</span>
        </p>
        <p className="type-body" style={{ marginTop: "20px", fontSize: "13px", color: "var(--ink-40)", maxWidth: "320px" }}>
          Add products to your ikas store — they will appear here after syncing.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "24px", alignItems: "center" }}>
          <a
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "var(--ink)",
              color: "var(--paper)",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
            }}
          >
            Add products in ikas →
          </a>
          <SyncButton variant="ghost" label="Already added? Sync" />
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="products-heading" style={{ paddingBlock: "48px 64px" }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: "32px" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <p className="type-caption" style={{ marginBottom: "8px" }}>Products</p>
            <h2 id="products-heading" style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 0.95 }}>
              Readiness
              <br />
              <span style={{ color: "var(--ink-40)" }}>overview</span>
            </h2>
          </div>
          <div style={{ paddingTop: "4px", display: "flex", gap: "8px", alignItems: "center" }}>
            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "8px 14px",
                background: "var(--ink)",
                color: "var(--paper)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: "2px",
              }}
            >
              ikas admin →
            </a>
            <SyncButton variant="ghost" label="Sync" />
          </div>
        </div>
      </motion.div>

      <div className="power-grid" style={{ rowGap: "clamp(8px, 1vw, 16px)", alignItems: "start" }}>
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} delay={0.1 + i * 0.07} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="type-body"
        style={{ marginTop: "24px", fontSize: "12px", color: "var(--ink-40)" }}
      >
        Products are scored by category assignment and variant completeness.
      </motion.p>
    </section>
  );
}

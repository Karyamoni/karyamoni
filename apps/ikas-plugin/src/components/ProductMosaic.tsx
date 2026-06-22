"use client";

import { motion } from "framer-motion";

type ProductState = "live" | "ready" | "missing" | "unsupported";

interface ProductEntry {
  id: string;
  name: string;
  category: string;
  state: ProductState;
  readinessScore?: number;
  missingFields?: string[];
}

// Mock data — replace with real IKAS product sync data
const PRODUCTS: ProductEntry[] = [
  {
    id: "p1",
    name: "Essential Cotton Tee",
    category: "T-Shirt",
    state: "live",
    readinessScore: 98,
  },
  {
    id: "p2",
    name: "Oxford Button-Down",
    category: "Shirt",
    state: "ready",
    readinessScore: 91,
  },
  {
    id: "p3",
    name: "Merino Crewneck",
    category: "Sweater",
    state: "missing",
    readinessScore: 44,
    missingFields: ["Shoulder width", "Chest measurement"],
  },
  {
    id: "p4",
    name: "Linen Blouse",
    category: "Blouse",
    state: "missing",
    readinessScore: 62,
    missingFields: ["Size chart"],
  },
  {
    id: "p5",
    name: "Denim Jacket",
    category: "Outerwear",
    state: "unsupported",
  },
];

// Mosaic grid spans — varied density signals state, not symmetry
const SPAN_MAP: Record<ProductState, string> = {
  live: "1 / 9",        // 8 cols — dominant
  ready: "1 / 7",       // 6 cols — substantial
  missing: "1 / 5",     // 4 cols — compact
  unsupported: "1 / 4", // 3 cols — minimal
};

const STATE_LABELS: Record<ProductState, string> = {
  live: "Live",
  ready: "Ready",
  missing: "Missing Data",
  unsupported: "Unsupported",
};

function ProductCard({
  product,
  delay,
}: {
  product: ProductEntry;
  delay: number;
}) {
  const isLive = product.state === "live";
  const isMissing = product.state === "missing";
  const isUnsupported = product.state === "unsupported";

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
      {/* Category label */}
      <p
        className="type-caption"
        style={{
          marginBottom: isLive ? "12px" : "8px",
          color: isLive ? "rgba(250,250,249,0.5)" : "var(--ink-60)",
        }}
      >
        {product.category}
      </p>

      {/* Product name — scale varies by state */}
      <h3
        style={{
          fontSize: isLive
            ? "clamp(24px, 3.5vw, 42px)"
            : product.state === "ready"
            ? "clamp(18px, 2.5vw, 28px)"
            : "clamp(14px, 1.8vw, 18px)",
          fontWeight: 500,
          letterSpacing: isLive ? "-0.03em" : "-0.01em",
          lineHeight: 1.1,
          color: isLive
            ? "var(--paper)"
            : isUnsupported
            ? "var(--ink-40)"
            : "var(--ink)",
          marginBottom: "12px",
        }}
      >
        {product.name}
      </h3>

      {/* Score — only for live/ready */}
      {product.readinessScore !== undefined && !isUnsupported && (
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
          <span
            style={{
              fontSize: "0.3em",
              verticalAlign: "super",
              color: isLive ? "rgba(190,255,92,0.6)" : "var(--ink-40)",
            }}
          >
            %
          </span>
        </p>
      )}

      {/* Missing fields list */}
      {isMissing && product.missingFields && (
        <ul style={{ listStyle: "none", marginTop: "8px" }}>
          {product.missingFields.map((f) => (
            <li
              key={f}
              className="type-caption"
              style={{
                fontSize: "10px",
                color: "var(--coral)",
                paddingBlock: "2px",
                borderBottom: "1px solid rgba(255,107,91,0.15)",
              }}
            >
              ↳ {f}
            </li>
          ))}
        </ul>
      )}

      {/* Status badge */}
      <div style={{ marginTop: isLive ? "20px" : "12px" }}>
        <span
          style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: "2px",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            ...(isLive && {
              background: "var(--lime)",
              color: "var(--ink)",
            }),
            ...(product.state === "ready" && {
              border: "1px solid var(--lime)",
              color: "var(--ink)",
            }),
            ...(isMissing && {
              border: "1px solid var(--coral)",
              color: "var(--coral)",
            }),
            ...(isUnsupported && {
              border: "1px solid var(--mist-deep)",
              color: "var(--ink-40)",
            }),
          }}
        >
          {STATE_LABELS[product.state]}
        </span>
      </div>
    </motion.article>
  );
}

export function ProductMosaic() {
  return (
    <section aria-labelledby="products-heading" style={{ paddingBlock: "48px 64px" }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: "32px" }}
      >
        <p className="type-caption" style={{ marginBottom: "8px" }}>
          Products
        </p>
        <h2
          id="products-heading"
          style={{
            fontSize: "clamp(36px, 5vw, 72px)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
          }}
        >
          Readiness
          <br />
          <span style={{ color: "var(--ink-40)" }}>overview</span>
        </h2>
      </motion.div>

      {/* Mosaic grid — NOT uniform rows, varied density per product state */}
      <div
        className="power-grid"
        style={{ rowGap: "clamp(8px, 1vw, 16px)", alignItems: "start" }}
      >
        {PRODUCTS.map((product, i) => (
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
        MVP focuses on Tops category — t-shirts, shirts, blouses, sweaters
      </motion.p>
    </section>
  );
}

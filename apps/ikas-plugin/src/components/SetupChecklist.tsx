"use client";

import { motion } from "framer-motion";
import { SyncButton } from "@/components/SyncButton";

type Props = {
  storeName: string | null;
  appInstalled: boolean;
  permissionsGranted: boolean;
  firstProductSynced: boolean;
};

const ITEM_BASE_DELAY = 0.2;
const ITEM_STAGGER = 0.08;

function ChecklistRow({
  index,
  label,
  description,
  done,
  delay,
  cta,
}: {
  index: string;
  label: string;
  description: string;
  done: boolean;
  delay: number;
  cta?: { label: string; href: string; showSync?: boolean };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="power-grid items-baseline"
      style={{ paddingBlock: "20px", borderBottom: "1px solid var(--ink-05)" }}
    >
      <div
        style={{
          gridColumn: "1 / 2",
          fontSize: "clamp(28px, 3.5vw, 48px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: done ? "var(--ink)" : "var(--ink-40)",
        }}
      >
        {index}
      </div>

      <div style={{ gridColumn: "3 / 9" }}>
        <p
          style={{
            fontSize: "clamp(15px, 1.4vw, 18px)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            marginBottom: "4px",
            color: done ? "var(--ink)" : "var(--ink-60)",
          }}
        >
          {label}
        </p>
        <p className="type-body" style={{ fontSize: "13px", color: "var(--ink-40)" }}>
          {description}
        </p>
        {!done && cta && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px", alignItems: "center" }}>
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                background: "var(--ink)",
                color: "var(--paper)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: "2px",
              }}
            >
              {cta.label} →
            </a>
            {cta.showSync && <SyncButton variant="ghost" label="Sync now" />}
          </div>
        )}
      </div>

      <div style={{ gridColumn: "10 / 13", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        {done ? (
          <span
            style={{
              background: "var(--lime)",
              color: "var(--ink)",
              padding: "3px 10px",
              borderRadius: "2px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Done
          </span>
        ) : (
          <span
            style={{
              border: "1px solid var(--ink-20)",
              color: "var(--ink-60)",
              padding: "3px 10px",
              borderRadius: "2px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Pending
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function SetupChecklist({ storeName, appInstalled, permissionsGranted, firstProductSynced }: Props) {
  const adminUrl = storeName
    ? `https://${storeName}.myikas.com/admin/product`
    : "https://app.myikas.com";
  const items = [
    {
      index: "01",
      label: "App Installed",
      description: "Karyamoni is active in your IKAS app store",
      done: appInstalled,
    },
    {
      index: "02",
      label: "Permissions Granted",
      description: "Product read, variant access, and order data approved",
      done: permissionsGranted,
    },
    {
      index: "03",
      label: "First Product Synced",
      description: "At least one product with a category assigned. Open ikas admin → Catalog → Products.",
      done: firstProductSynced,
      cta: { label: "Add products in ikas", href: adminUrl, showSync: true },
    },
    {
      index: "04",
      label: "Return Data Connected",
      description: "Return rate baseline established for impact tracking",
      done: false,
    },
  ];

  const completed = items.filter((i) => i.done).length;

  return (
    <section aria-labelledby="setup-heading" style={{ paddingBlock: "48px 64px" }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="power-grid"
        style={{ marginBottom: "32px" }}
      >
        <div style={{ gridColumn: "1 / 9" }}>
          <p className="type-caption" style={{ marginBottom: "8px" }}>Setup</p>
          <h2
            id="setup-heading"
            style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 0.95 }}
          >
            {completed} of {items.length}
            <br />
            <span style={{ color: "var(--ink-40)" }}>complete</span>
          </h2>
        </div>
        <div style={{ gridColumn: "10 / 13", alignSelf: "end" }}>
          <p className="type-body" style={{ fontSize: "13px" }}>
            Complete all steps to activate Karyamoni on your product pages.
          </p>
        </div>
      </motion.div>

      <div>
        {items.map((item, i) => (
          <ChecklistRow
            key={item.index}
            {...item}
            delay={ITEM_BASE_DELAY + i * ITEM_STAGGER}
          />
        ))}
      </div>
    </section>
  );
}

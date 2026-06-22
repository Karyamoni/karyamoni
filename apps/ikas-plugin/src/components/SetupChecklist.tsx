"use client";

import { motion } from "framer-motion";

interface ChecklistItem {
  id: string;
  index: string;
  label: string;
  description: string;
  done: boolean;
}

const CHECKLIST: ChecklistItem[] = [
  {
    id: "app-installed",
    index: "01",
    label: "App Installed",
    description: "Karyamoni is active in your IKAS app store",
    done: true,
  },
  {
    id: "permissions",
    index: "02",
    label: "Permissions Granted",
    description: "Product read, variant access, and order data approved",
    done: true,
  },
  {
    id: "product-sync",
    index: "03",
    label: "First Product Synced",
    description: "At least one top-category product mapped for try-on",
    done: false,
  },
  {
    id: "return-data",
    index: "04",
    label: "Return Data Connected",
    description: "Return rate baseline established for impact tracking",
    done: false,
  },
];

// Stagger timeline per SKILL.md choreography spec:
// 0ms:   section header
// 200ms: item 1
// 280ms: item 2
// 360ms: item 3
// 440ms: item 4
const ITEM_BASE_DELAY = 0.2;
const ITEM_STAGGER = 0.08;

function ChecklistRow({
  item,
  delay,
}: {
  item: ChecklistItem;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="power-grid items-baseline"
      style={{
        paddingBlock: "20px",
        borderBottom: "1px solid var(--ink-05)",
        opacity: item.done ? 1 : 0.55,
      }}
    >
      {/* Index number — Power line 1 */}
      <div
        className="anchor-1"
        style={{
          gridColumn: "1 / 2",
          fontSize: "clamp(28px, 3.5vw, 48px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: item.done ? "var(--ink)" : "var(--ink-40)",
        }}
      >
        {item.index}
      </div>

      {/* Label + description — Power line 5 */}
      <div style={{ gridColumn: "3 / 9" }}>
        <p
          style={{
            fontSize: "clamp(15px, 1.4vw, 18px)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            marginBottom: "4px",
          }}
        >
          {item.label}
        </p>
        <p className="type-body" style={{ fontSize: "13px" }}>
          {item.description}
        </p>
      </div>

      {/* Status — Power line 9 */}
      <div
        style={{
          gridColumn: "10 / 13",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {item.done ? (
          <span
            className="type-caption"
            style={{
              background: "var(--lime)",
              color: "var(--ink)",
              padding: "3px 10px",
              borderRadius: "2px",
              fontSize: "10px",
            }}
          >
            Done
          </span>
        ) : (
          <span
            className="type-caption"
            style={{
              border: "1px solid var(--mist-deep)",
              color: "var(--ink-60)",
              padding: "3px 10px",
              borderRadius: "2px",
              fontSize: "10px",
            }}
          >
            Pending
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function SetupChecklist() {
  const completed = CHECKLIST.filter((i) => i.done).length;

  return (
    <section aria-labelledby="setup-heading" style={{ paddingBlock: "48px 64px" }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="power-grid"
        style={{ marginBottom: "32px" }}
      >
        <div style={{ gridColumn: "1 / 9" }}>
          <p className="type-caption" style={{ marginBottom: "8px" }}>
            Setup
          </p>
          <h2
            id="setup-heading"
            style={{
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
            }}
          >
            {completed} of {CHECKLIST.length}
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

      {/* Checklist items */}
      <div>
        {CHECKLIST.map((item, i) => (
          <ChecklistRow
            key={item.id}
            item={item}
            delay={ITEM_BASE_DELAY + i * ITEM_STAGGER}
          />
        ))}
      </div>
    </section>
  );
}

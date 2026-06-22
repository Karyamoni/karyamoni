"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface MetricProps {
  value: string;
  label: string;
  sublabel?: string;
  accent?: "lime" | "coral" | "default";
  delay?: number;
}

function useCountUp(target: number, active: boolean, duration = 1.4) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      // Expo out easing
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

function MonumentalMetric({ value, label, sublabel, accent = "default", delay = 0 }: MetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  // Parse numeric value for countup
  const numericMatch = value.match(/[\d,]+/);
  const numericValue = numericMatch
    ? parseInt(numericMatch[0].replace(/,/g, ""), 10)
    : null;
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.match(/[^0-9,]*$/)?.[0] ?? "";

  const counted = useCountUp(numericValue ?? 0, inView && numericValue !== null);

  const displayValue =
    numericValue !== null
      ? `${prefix}${counted.toLocaleString()}${suffix}`
      : value;

  const accentColor =
    accent === "lime"
      ? "var(--lime)"
      : accent === "coral"
      ? "var(--coral)"
      : "var(--ink)";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: "32px 0", borderTop: "1px solid var(--ink-10)" }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: "var(--display)",
          letterSpacing: "var(--display-tracking)",
          lineHeight: "var(--display-leading)",
          fontWeight: 500,
          color: accentColor,
        }}
        aria-label={value}
      >
        {displayValue}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
        style={{ marginTop: "12px" }}
      >
        <p
          style={{
            fontSize: "var(--body)",
            lineHeight: "var(--body-leading)",
            color: "var(--ink-80)",
            maxWidth: "280px",
          }}
        >
          {label}
        </p>
        {sublabel && (
          <p
            className="type-caption"
            style={{ marginTop: "4px", color: "var(--ink-40)" }}
          >
            {sublabel}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

export function MetricsDisplay() {
  return (
    <section aria-labelledby="metrics-heading" style={{ paddingBlock: "48px 64px" }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: "32px" }}
      >
        <p className="type-caption" style={{ marginBottom: "8px" }}>
          Analytics
        </p>
        <h2
          id="metrics-heading"
          style={{
            fontSize: "clamp(36px, 5vw, 72px)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
          }}
        >
          Impact
          <br />
          <span style={{ color: "var(--ink-40)" }}>signals</span>
        </h2>
      </motion.div>

      <div>
        <MonumentalMetric
          value="−18%"
          label="return rate reduction since try-on activation"
          sublabel="Pilot baseline vs. post-activation"
          accent="lime"
          delay={0.1}
        />
        <MonumentalMetric
          value="1,248"
          label="total try-on sessions this month"
          sublabel="Desktop + mobile web"
          delay={0.2}
        />
        <MonumentalMetric
          value="+24%"
          label="add-to-cart rate after try-on completion"
          sublabel="vs. sessions without try-on"
          accent="lime"
          delay={0.3}
        />
        <MonumentalMetric
          value="91%"
          label="fit confidence — shoppers rating their size recommendation accurate"
          sublabel="Based on post-purchase survey sample"
          delay={0.4}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="type-caption"
        style={{ marginTop: "32px", color: "var(--ink-40)" }}
      >
        Data updates every 24 hours · Pilot phase metrics
      </motion.p>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type PermissionStatus = "connected" | "pending" | "error";

interface RailState {
  permission: PermissionStatus;
  productSync: PermissionStatus;
  returnData: PermissionStatus;
  lastSyncAt: Date | null;
}

const statusLabel: Record<PermissionStatus, string> = {
  connected: "Connected",
  pending: "Pending",
  error: "Error",
};

function StatusDot({ status }: { status: PermissionStatus }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full"
      style={{
        background:
          status === "connected"
            ? "var(--lime)"
            : status === "pending"
            ? "var(--ink-40)"
            : "var(--coral)",
      }}
    />
  );
}

function RailRow({
  label,
  status,
  delay,
}: {
  label: string;
  status: PermissionStatus;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-0.5"
    >
      <span className="type-caption" style={{ fontSize: "10px" }}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <StatusDot status={status} />
        <span
          className="type-caption"
          style={{
            fontSize: "10px",
            textTransform: "none",
            letterSpacing: 0,
            color:
              status === "connected"
                ? "var(--ink)"
                : status === "error"
                ? "var(--coral)"
                : "var(--ink-60)",
          }}
        >
          {statusLabel[status]}
        </span>
      </div>
    </motion.div>
  );
}

export function IKASIntegrationRail() {
  const [rail, setRail] = useState<RailState>({
    permission: "connected",
    productSync: "connected",
    returnData: "pending",
    lastSyncAt: new Date(),
  });

  // In production: subscribe to @ikas/app-bridge events for real-time updates
  useEffect(() => {
    // Placeholder for app-bridge event subscription
    // bridge.on('permission:update', (data) => setRail(prev => ({ ...prev, permission: data.status })))
  }, []);

  const formatSync = (d: Date | null) => {
    if (!d) return "Never";
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 h-screen flex flex-col justify-between py-8"
      style={{
        borderRight: "1px solid var(--ink-10)",
        paddingRight: "16px",
        minWidth: "80px",
      }}
      aria-label="IKAS integration status"
    >
      {/* Top: Karyamoni wordmark rotated */}
      <div
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          letterSpacing: "0.12em",
          fontSize: "10px",
          fontWeight: 600,
          color: "var(--ink-40)",
          textTransform: "uppercase",
        }}
      >
        Karyamoni
      </div>

      {/* Middle: Status indicators */}
      <div className="flex flex-col gap-5">
        <RailRow label="APP" status={rail.permission} delay={0.1} />
        <RailRow label="SYNC" status={rail.productSync} delay={0.18} />
        <RailRow label="RETURNS" status={rail.returnData} delay={0.26} />
      </div>

      {/* Bottom: Last sync */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col gap-0.5"
      >
        <span className="type-caption" style={{ fontSize: "9px" }}>
          LAST SYNC
        </span>
        <span
          style={{ fontSize: "10px", color: "var(--ink-60)", lineHeight: 1.3 }}
        >
          {formatSync(rail.lastSyncAt)}
        </span>
      </motion.div>
    </motion.aside>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  label?: string;
  variant?: "primary" | "ghost";
};

export function SyncButton({ label = "Sync products", variant = "primary" }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const router = useRouter();

  async function handleSync() {
    setState("loading");
    try {
      const res = await fetch("/api/ikas/sync", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      setState("done");
      router.refresh();
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  const isPrimary = variant === "primary";

  return (
    <button
      onClick={handleSync}
      disabled={state === "loading"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: isPrimary ? "8px 16px" : "6px 12px",
        background: isPrimary ? "var(--ink)" : "transparent",
        color: isPrimary ? "var(--paper)" : "var(--ink-60)",
        border: isPrimary ? "none" : "1px solid var(--ink-20)",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        borderRadius: "2px",
        cursor: state === "loading" ? "wait" : "pointer",
        opacity: state === "loading" ? 0.7 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {state === "loading" && (
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ animation: "spin 0.8s linear infinite" }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="14 8" />
        </svg>
      )}
      {state === "loading"
        ? "Syncing..."
        : state === "done"
        ? "Synced"
        : state === "error"
        ? "Sync failed — retry"
        : label}
    </button>
  );
}

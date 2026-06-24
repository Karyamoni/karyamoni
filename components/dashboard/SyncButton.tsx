"use client";

import { useState, useTransition } from "react";
import { syncIkasProducts } from "@/app/actions/ikas";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  function handleSync() {
    setStatus("idle");
    startTransition(async () => {
      const result = await syncIkasProducts();
      setStatus(result.ok ? "done" : "error");
      if (result.ok) setTimeout(() => setStatus("idle"), 2500);
    });
  }

  return (
    <button
      onClick={handleSync}
      disabled={isPending}
      className="k-label flex items-center gap-2 rounded border border-[var(--color-ink-faint)] px-3 py-1.5 text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] disabled:cursor-wait disabled:opacity-50"
    >
      {isPending && (
        <svg className="h-3 w-3 animate-spin" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="14 8" />
        </svg>
      )}
      {isPending ? "Syncing…" : status === "done" ? "Synced" : status === "error" ? "Failed — retry" : "Sync products"}
    </button>
  );
}

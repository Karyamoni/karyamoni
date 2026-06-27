"use client";

import { useState } from "react";
import { ArrowRight, Loader2, RefreshCw } from "lucide-react";

type Props = {
  storeName?: string;
  reconnect?: boolean;
};

export function IkasConnectForm({ storeName: prefill, reconnect }: Props) {
  const [storeName, setStoreName] = useState(prefill ?? "");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    if (!storeName.trim()) { e.preventDefault(); return; }
    setLoading(true);
  }

  if (reconnect && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="k-label flex items-center gap-1.5 text-[var(--color-ink-soft)] underline hover:text-[var(--color-ink)]"
      >
        <RefreshCw size={11} />
        Reconnect
      </button>
    );
  }

  return (
    <form
      action="/api/ikas/link-store/start"
      method="GET"
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="storeName" className="k-label text-[var(--color-ink-soft)]">
          ikas store name
        </label>
        <div className="flex items-center gap-0">
          <input
            id="storeName"
            name="storeName"
            type="text"
            required
            placeholder="your-store"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="h-10 w-48 border border-[var(--color-ink)] bg-transparent px-3 text-sm font-black uppercase tracking-tight placeholder:text-[var(--color-ink-soft)] focus:outline-none focus:ring-1 focus:ring-[var(--color-ink)] sm:w-56"
          />
          <span className="flex h-10 items-center border border-l-0 border-[var(--color-ink)] bg-[var(--color-ink-soft)]/10 px-2 text-xs text-[var(--color-ink-soft)]">
            .myikas.com
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !storeName.trim()}
        className="mt-5 flex h-10 items-center gap-2 self-end border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 text-sm font-black uppercase text-[var(--color-paper)] transition-opacity hover:opacity-80 disabled:opacity-40 sm:self-auto sm:mt-0"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" aria-hidden />
        ) : (
          <ArrowRight size={14} aria-hidden />
        )}
        {reconnect ? "Reconnect" : "Connect"}
      </button>
    </form>
  );
}

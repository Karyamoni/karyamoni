"use client";

import { useEffect, useRef, useState } from "react";
import { get as idbGet, set as idbSet } from "idb-keyval";

const CACHE_VERSION = "rmbg_v1_";
let workerInstance: Worker | null = null;
const pendingCallbacks = new Map<string, (blob: Blob | null, error?: string) => void>();

function getWorker(): Worker {
  if (!workerInstance) {
    workerInstance = new Worker(new URL("../../workers/rmbg.worker.ts", import.meta.url), {
      type: "module",
    });
    workerInstance.onmessage = (e: MessageEvent<{ id: string; blob?: Blob; error?: string }>) => {
      const { id, blob, error } = e.data;
      const cb = pendingCallbacks.get(id);
      if (cb) {
        pendingCallbacks.delete(id);
        cb(blob ?? null, error);
      }
    };
  }
  return workerInstance;
}

export function useBackgroundRemoval(imageUrl: string | null) {
  const [maskedUrl, setMaskedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;
    const cacheKey = CACHE_VERSION + imageUrl;

    async function run() {
      // Check IndexedDB cache first
      const cached = await idbGet<ArrayBuffer>(cacheKey);
      if (cached && !cancelled) {
        const blob = new Blob([cached], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setMaskedUrl(url);
        return;
      }

      setIsProcessing(true);

      const worker = getWorker();
      const id = `${Date.now()}_${Math.random()}`;

      pendingCallbacks.set(id, async (blob, error) => {
        if (cancelled) return;
        if (error || !blob) {
          console.error("[rmbg] background removal failed:", error);
          // Fall back to original image
          setMaskedUrl(imageUrl);
          setIsProcessing(false);
          return;
        }
        // Cache in IndexedDB
        const buf = await blob.arrayBuffer();
        await idbSet(cacheKey, buf);

        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setMaskedUrl(url);
        setIsProcessing(false);
      });

      worker.postMessage({ id, imageUrl });
    }

    run();

    return () => {
      cancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setMaskedUrl(null);
      setIsProcessing(false);
    };
  }, [imageUrl]);

  return { maskedUrl, isProcessing };
}

"use server";

import { revalidatePath } from "next/cache";

export async function syncIkasProducts(): Promise<{ ok: boolean; productCount?: number; error?: string }> {
  const pluginUrl = process.env.IKAS_PLUGIN_URL;
  const secret = process.env.LINK_STORE_SECRET;

  if (!pluginUrl) return { ok: false, error: "Plugin URL not configured" };

  try {
    const res = await fetch(`${pluginUrl}/api/ikas/sync`, {
      method: "POST",
      headers: secret ? { "x-link-secret": secret } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }

    const data = await res.json() as { synced: boolean; productCount: number };
    revalidatePath("/[locale]/dashboard/products", "page");
    return { ok: true, productCount: data.productCount };
  } catch {
    return { ok: false, error: "Plugin unreachable" };
  }
}

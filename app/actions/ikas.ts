"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function syncIkasProducts(): Promise<{ ok: boolean; productCount?: number; error?: string }> {
  const pluginUrl = process.env.IKAS_PLUGIN_URL;
  if (!pluginUrl) return { ok: false, error: "Plugin URL not configured" };

  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const profile = await db.merchantProfile.findUnique({
    where: { userId: user.id },
    include: { stores: { take: 1 } },
  });
  const store = profile?.stores[0];
  if (!store?.accessToken) return { ok: false, error: "Store not linked" };

  try {
    const res = await fetch(`${pluginUrl}/api/ikas/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${store.accessToken}` },
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

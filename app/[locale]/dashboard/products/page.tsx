import { notFound } from "next/navigation";
import { ProductsSection } from "@/components/dashboard/ProductsSection";
import { getContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

type Props = { params: Promise<{ locale: string }> };

type Product = { id: string; name: string; category: string; imageUrl: string | null; modelUrl?: string | null; state: "live" | "ready" | "missing"; readinessScore: number; missingFields?: string[] };

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await db.merchantProfile.findUnique({
    where: { userId: user.id },
    include: { stores: { take: 1 } },
  });
  const isConnected = profile?.stores[0]?.installStatus === "connected";

  let products: Product[] = [];
  let pluginError: string | undefined;
  if (isConnected) {
    const pluginUrl = process.env.IKAS_PLUGIN_URL;
    if (!pluginUrl) {
      pluginError = "IKAS_PLUGIN_URL not configured";
    } else {
      try {
        const res = await fetch(`${pluginUrl}/api/ikas/products`, {
          headers: profile?.stores[0]?.accessToken
            ? { Authorization: `Bearer ${profile.stores[0].accessToken}` }
            : {},
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          products = data.products ?? [];
        } else {
          const body = await res.text();
          pluginError = `Plugin error ${res.status}: ${body}`;
          console.error("[ProductsPage] plugin fetch failed:", res.status, body);
        }
      } catch (err) {
        pluginError = "Plugin unreachable";
        console.error("[ProductsPage] plugin unreachable:", err);
      }
    }
  }

  return (
    <ProductsSection
      content={getContent(locale as Locale)}
      products={products}
      isConnected={isConnected}
      ikasPluginUrl={process.env.IKAS_PLUGIN_URL ?? null}
      pluginError={pluginError}
    />
  );
}

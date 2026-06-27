import { notFound } from "next/navigation";
import { ImpactSection } from "@/components/dashboard/ImpactSection";
import { getContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

type Props = { params: Promise<{ locale: string }> };

export default async function ImpactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await db.merchantProfile.findUnique({
    where: { userId: user.id },
    include: { stores: { take: 1 } },
  });
  const ikasConnected = profile?.stores[0]?.installStatus === "connected";

  let productCount = 0;
  if (ikasConnected) {
    const pluginUrl = process.env.IKAS_PLUGIN_URL;
    if (pluginUrl) {
      try {
        const res = await fetch(`${pluginUrl}/api/ikas/products`, {
          headers: profile?.stores[0]?.accessToken
            ? { Authorization: `Bearer ${profile.stores[0].accessToken}` }
            : {},
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          productCount = data.products?.length ?? 0;
        } else {
          const body = await res.text();
          console.error("[ImpactPage] plugin fetch failed:", res.status, body);
        }
      } catch (err) {
        console.error("[ImpactPage] plugin unreachable:", err);
      }
    }
  }

  return (
    <ImpactSection
      content={getContent(locale as Locale)}
      installStatus={{
        appInstalled: ikasConnected,
        permissionsGranted: ikasConnected,
        productSyncRunning: productCount > 0,
        returnDataConnected: false,
      }}
    />
  );
}

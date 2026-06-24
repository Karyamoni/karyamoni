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
          headers: { "x-link-secret": process.env.LINK_STORE_SECRET ?? "" },
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          productCount = data.products?.length ?? 0;
        }
      } catch {
        // plugin offline
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

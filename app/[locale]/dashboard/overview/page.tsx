import { notFound } from "next/navigation";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { getContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

type Props = { params: Promise<{ locale: string }> };

export default async function OverviewPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await db.merchantProfile.findUnique({
    where: { userId: user.id },
    include: { stores: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const store = profile?.stores[0] ?? null;

  return (
    <OverviewSection
      content={getContent(locale as Locale)}
      user={user}
      store={store ? { name: store.name, installStatus: store.installStatus } : null}
    />
  );
}

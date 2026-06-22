import { notFound } from "next/navigation";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { getContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/session";

type Props = { params: Promise<{ locale: string }> };

export default async function OverviewPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const user = await getCurrentUser();
  if (!user) return null;

  return <OverviewSection content={getContent(locale as Locale)} user={user} />;
}

import { notFound } from "next/navigation";
import { ImpactSection } from "@/components/dashboard/ImpactSection";
import { getContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function ImpactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ImpactSection content={getContent(locale as Locale)} />;
}

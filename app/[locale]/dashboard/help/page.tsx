import { notFound } from "next/navigation";
import { HelpSection } from "@/components/dashboard/HelpSection";
import { isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <HelpSection locale={locale as Locale} />;
}

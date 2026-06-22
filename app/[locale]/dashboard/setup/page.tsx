import { notFound } from "next/navigation";
import { SetupSection } from "@/components/dashboard/SetupSection";
import { getContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function SetupPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <SetupSection content={getContent(locale as Locale)} />;
}

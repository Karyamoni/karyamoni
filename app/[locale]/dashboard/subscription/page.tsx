import { notFound } from "next/navigation";
import { SubscriptionSection } from "@/components/dashboard/SubscriptionSection";
import { isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function SubscriptionPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <SubscriptionSection />;
}

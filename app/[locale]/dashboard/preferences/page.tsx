import { notFound } from "next/navigation";
import { PreferencesSection } from "@/components/dashboard/PreferencesSection";
import { isLocale, type Locale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/session";
import { getUserMfaStatus } from "@/lib/mfa";

type Props = { params: Promise<{ locale: string }> };

export default async function PreferencesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const user = await getCurrentUser();
  if (!user) return null;

  const mfa = await getUserMfaStatus(user.id);

  return <PreferencesSection user={user} locale={locale as Locale} mfaEnabled={mfa.enabled} />;
}

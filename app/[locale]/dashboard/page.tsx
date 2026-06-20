import { redirect, notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { PilotDashboard } from "@/components/dashboard/PilotDashboard";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/session";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/dashboard`);
  }

  return (
    <>
      <SiteHeader locale={locale} />
      <PilotDashboard locale={locale} content={getContent(locale)} user={user} />
    </>
  );
}

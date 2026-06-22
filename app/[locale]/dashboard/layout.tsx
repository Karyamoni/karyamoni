import { redirect, notFound } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { isLocale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/session";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardRootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/dashboard`);
  }

  return (
    <DashboardLayout user={user} locale={locale}>
      {children}
    </DashboardLayout>
  );
}

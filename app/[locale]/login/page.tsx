import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale={locale} />
      <LoginPanel locale={locale} content={getContent(locale)} />
    </>
  );
}

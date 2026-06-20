import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/session";
import { SiteHeader } from "@/components/SiteHeader";
import { PlaygroundDemo } from "@/components/playground/PlaygroundDemo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function PlaygroundPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const user = await getCurrentUser();

  return (
    <>
      <SiteHeader locale={locale} />
      <PlaygroundDemo locale={locale} content={getContent(locale)} isAuthenticated={Boolean(user)} />
    </>
  );
}

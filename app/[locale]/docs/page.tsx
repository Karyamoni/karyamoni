import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { DocsAccordion } from "@/components/docs/DocsAccordion";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DocsPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = getContent(locale);

  return (
    <main className="min-h-screen bg-[var(--color-paper)] pt-16 text-[var(--color-ink)]">
      <SiteHeader locale={locale} />
      <section className="border-b k-hairline">
        <div className="k-grid min-h-[360px] content-between py-6 md:py-8">
          <p className="k-label col-span-4 md:col-span-2">Public docs</p>
          <h1 className="k-display col-span-4 md:col-span-6 lg:col-span-7">{content.docs.title}</h1>
          <p className="k-body col-span-4 text-xl md:col-span-4 md:text-2xl lg:col-span-3">{content.docs.lead}</p>
        </div>
      </section>

      <section className="k-grid py-4 md:py-6">
        <DocsAccordion sections={content.docs.sections} />
      </section>
    </main>
  );
}

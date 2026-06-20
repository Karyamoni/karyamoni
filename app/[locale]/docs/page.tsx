import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
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
        <div className="col-span-4 border border-[var(--color-ink)] md:col-span-8 lg:col-span-12">
          {content.docs.sections.map((section, index) => (
            <article key={section.title} className="grid border-b border-[var(--color-ink)] last:border-b-0 md:grid-cols-[240px_1fr]">
              <div className="border-b border-[var(--color-ink)] p-4 md:border-b-0 md:border-r">
                <p className="k-label text-[var(--color-signal)]">0{index + 1}</p>
                <h2 className="mt-12 text-4xl font-black uppercase leading-none">{section.title}</h2>
              </div>
              <div className="p-4">
                <p className="max-w-3xl text-3xl font-black uppercase leading-none md:text-5xl">{section.body}</p>
                <div className="mt-10 grid border border-[var(--color-ink)] sm:grid-cols-3">
                  {section.points.map((point) => (
                    <p key={point} className="border-b border-[var(--color-ink)] p-4 text-lg font-black uppercase leading-none last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                      {point}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

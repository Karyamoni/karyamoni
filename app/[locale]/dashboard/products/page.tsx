import { notFound } from "next/navigation";
import { ProductsSection } from "@/components/dashboard/ProductsSection";
import { getContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ProductsSection content={getContent(locale as Locale)} />;
}

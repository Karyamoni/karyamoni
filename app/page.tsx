import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, detectLocale, isLocale } from "@/lib/i18n";

export default async function RootPage() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const savedLocale = cookieStore.get("karyamoni_locale")?.value;
  const locale = savedLocale && isLocale(savedLocale)
    ? savedLocale
    : detectLocale(headerStore.get("accept-language")) ?? defaultLocale;

  redirect(`/${locale}`);
}

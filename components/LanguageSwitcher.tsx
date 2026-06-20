"use client";

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { oppositeLocale, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale = oppositeLocale(locale);

  async function switchLocale() {
    const nextPath = pathname.replace(`/${locale}`, `/${nextLocale}`);

    await fetch("/api/locale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ locale: nextLocale })
    });

    router.push(nextPath);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      className="flex items-center gap-2 rounded-full border border-current bg-transparent px-3 py-2 text-sm font-black uppercase transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
      aria-label={`Switch language to ${nextLocale}`}
    >
      <Languages size={16} aria-hidden />
      {nextLocale.toUpperCase()}
    </button>
  );
}

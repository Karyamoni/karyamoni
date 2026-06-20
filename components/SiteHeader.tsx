import Link from "next/link";
import { ArrowUpRight, LogIn, PanelTop, Play, ScrollText } from "lucide-react";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type Props = {
  locale: Locale;
};

export function SiteHeader({ locale }: Props) {
  const copy = getContent(locale);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-[rgba(244,240,231,0.94)] backdrop-blur-xl k-hairline">
      <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center px-4 md:grid-cols-[1fr_auto_1fr] md:px-7">
        <Link href={`/${locale}`} className="flex min-w-0 items-center gap-2 text-lg font-black uppercase leading-none sm:gap-3 sm:text-xl">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-current text-sm">
            K
          </span>
          <span className="truncate">Karyamoni</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-black uppercase md:flex">
          <Link className="flex items-center gap-2 transition-colors hover:text-[var(--color-signal)]" href={`/${locale}/playground`}>
            <Play size={16} aria-hidden />
            {copy.nav.playground}
          </Link>
          <Link className="flex items-center gap-2 transition-colors hover:text-[var(--color-signal)]" href={`/${locale}/docs`}>
            <ScrollText size={16} aria-hidden />
            {copy.nav.docs}
          </Link>
          <Link className="flex items-center gap-2 transition-colors hover:text-[var(--color-signal)]" href={`/${locale}/dashboard`}>
            <PanelTop size={16} aria-hidden />
            {copy.nav.dashboard}
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <LanguageSwitcher locale={locale} />
          <Link
            href={`/${locale}/login`}
            className="hidden items-center gap-2 rounded-full border border-current bg-[var(--color-ink)] px-4 py-2 text-sm font-black uppercase text-[var(--color-paper)] transition-colors hover:bg-[var(--color-signal)] sm:flex"
          >
            <LogIn size={16} aria-hidden />
            {copy.nav.login}
            <ArrowUpRight size={15} aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}

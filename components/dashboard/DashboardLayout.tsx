"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CheckSquare, CreditCard, HelpCircle, LayoutDashboard, LogOut, Menu, MessageCircle, Package, Settings, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { CurrentUser } from "@/lib/session";
import type { Locale } from "@/lib/i18n";

type Props = {
  user: CurrentUser;
  locale: Locale;
  children: React.ReactNode;
};

const PRIMARY_NAV = (locale: string) => [
  { href: `/${locale}/dashboard/overview`, label: "Overview", icon: <LayoutDashboard size={15} aria-hidden /> },
  { href: `/${locale}/dashboard/products`, label: "Products", icon: <Package size={15} aria-hidden /> },
  { href: `/${locale}/dashboard/setup`, label: "Setup", icon: <CheckSquare size={15} aria-hidden /> },
  { href: `/${locale}/dashboard/impact`, label: "Impact", icon: <BarChart3 size={15} aria-hidden /> }
];

const SECONDARY_NAV = (locale: string) => [
  { href: `/${locale}/dashboard/preferences`, label: "Preferences", icon: <Settings size={15} aria-hidden /> },
  { href: `/${locale}/dashboard/subscription`, label: "Subscription", icon: <CreditCard size={15} aria-hidden /> },
  { href: `/${locale}/dashboard/help`, label: "Help", icon: <HelpCircle size={15} aria-hidden /> }
];

export function DashboardLayout({ user, locale, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const initial = user.name.trim()[0]?.toUpperCase() ?? "U";
  const identity = user.email ?? user.phone ?? "";
  const primaryNav = PRIMARY_NAV(locale);
  const secondaryNav = SECONDARY_NAV(locale);

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[var(--color-ink)] px-4 text-[var(--color-paper)]">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-sm font-black uppercase leading-none transition-opacity hover:opacity-70"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/30 text-xs">
              K
            </span>
            <span className="hidden text-white/50 sm:inline">Karyamoni</span>
          </Link>
          <span className="hidden text-white/25 sm:inline">/</span>
          <span className="text-sm font-black uppercase text-white">Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="[&_button]:border-white/20 [&_button]:text-white/70 [&_button:hover]:bg-white/10 [&_button:hover]:text-white">
            <LanguageSwitcher locale={locale} />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5" title={identity}>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-xs font-black text-[var(--color-ink)]">
              {initial}
            </span>
            <span className="hidden max-w-[120px] truncate text-xs font-black uppercase text-white/70 md:block">
              {user.name.split(" ")[0]}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="grid h-8 w-8 place-items-center rounded border border-white/20 text-white/70 transition-colors hover:text-white lg:hidden"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* ── Mobile overlay ─────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside
        className={`fixed bottom-0 left-0 top-14 z-40 flex w-60 flex-col border-r border-white/10 bg-[var(--color-ink)] text-[var(--color-paper)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* User card */}
        <div className="border-b border-white/10 p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime text-base font-black text-[var(--color-ink)]">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase leading-tight text-white">
                {user.name}
              </p>
              {identity && (
                <p className="mt-1 truncate text-xs font-bold leading-tight text-white/45">{identity}</p>
              )}
              <ProviderBadge provider={user.provider} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          <p className="k-label mb-3 px-5 text-white/30">Dashboard</p>
          {primaryNav.map(({ href, label, icon }) => (
            <NavLink key={href} href={href} label={label} icon={icon} pathname={pathname} onClose={() => setSidebarOpen(false)} />
          ))}

          <div className="mx-5 my-4 border-t border-white/10" />

          <p className="k-label mb-3 px-5 text-white/30">Account</p>
          {secondaryNav.map(({ href, label, icon }) => (
            <NavLink key={href} href={href} label={label} icon={icon} pathname={pathname} onClose={() => setSidebarOpen(false)} />
          ))}
        </nav>

        {/* Sign out */}
        <div className="border-t border-white/10 p-4">
          <a
            href={`/api/auth/logout?locale=${locale}`}
            className="flex items-center gap-2 text-sm font-black uppercase text-white/40 transition-colors hover:text-coral"
          >
            <LogOut size={14} aria-hidden />
            Sign out
          </a>
        </div>
      </aside>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="min-h-screen overflow-x-hidden pt-14 lg:ml-60">
        {children}
      </div>
    </>
  );
}

function NavLink({ href, label, icon, pathname, onClose }: { href: string; label: string; icon: React.ReactNode; pathname: string; onClose: () => void }) {
  const isActive = pathname === href || pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`flex items-center gap-3 px-5 py-3 text-sm font-black uppercase leading-none transition-colors ${
        isActive ? "bg-white/8 text-lime" : "text-white/50 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={isActive ? "text-lime" : "text-white/30"}>{icon}</span>
      {label}
      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />}
    </Link>
  );
}

function ProviderBadge({ provider }: { provider: "google" | "whatsapp" }) {
  if (provider === "google") {
    return (
      <span className="mt-2 inline-flex items-center gap-1 rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-black uppercase text-white/40">
        <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </span>
    );
  }
  return (
    <span className="mt-2 inline-flex items-center gap-1 rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-black uppercase text-white/40">
      <MessageCircle size={10} aria-hidden />
      WhatsApp
    </span>
  );
}

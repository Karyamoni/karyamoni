"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type Props = { locale: Locale };

const HEADLINE = "Fit perfect. Keep everything.";

const spheres = [
  { id: 1,  x: 142, y: 155, size: 122, bg: "linear-gradient(145deg,#c4956a 0%,#8b5e3c 55%,#5c3a1e 100%)" },
  { id: 2,  x: 278, y: 186, size: 108, bg: "linear-gradient(145deg,#87ceeb 0%,#4a90d9 50%,#1e3a6e 100%)" },
  { id: 3,  x: 70,  y: 270, size: 86,  bg: "linear-gradient(145deg,#f4a261 0%,#e76f51 50%,#c73c1a 100%)" },
  { id: 4,  x: 194, y: 312, size: 100, bg: "linear-gradient(145deg,#a8d8a8 0%,#52b788 50%,#2d6a4f 100%)" },
  { id: 5,  x: 322, y: 298, size: 78,  bg: "linear-gradient(145deg,#e0e0e0 0%,#bdbdbd 50%,#757575 100%)" },
  { id: 6,  x: 26,  y: 150, size: 68,  bg: "linear-gradient(145deg,#3a3a4a 0%,#1a1a2e 50%,#0d0d1a 100%)" },
  { id: 7,  x: 210, y: 90,  size: 76,  bg: "linear-gradient(145deg,#c9b1e8 0%,#9b59b6 50%,#6c3483 100%)" },
  { id: 8,  x: 380, y: 110, size: 60,  bg: "linear-gradient(145deg,#ffd700 0%,#ffa500 50%,#cc6600 100%)" },
  { id: 9,  x: 116, y: 394, size: 58,  bg: "linear-gradient(145deg,#b8e6e6 0%,#38b2ac 50%,#1a6b68 100%)" },
  { id: 10, x: 296, y: 422, size: 70,  bg: "linear-gradient(145deg,#f8c1cc 0%,#e91e8c 50%,#9c1060 100%)" },
  { id: 11, x: 428, y: 232, size: 50,  bg: "linear-gradient(145deg,#a5d8f7 0%,#5ba4cf 50%,#2c5f8a 100%)" },
  { id: 12, x: 58,  y: 374, size: 48,  bg: "linear-gradient(145deg,#c5e8c8 0%,#68bb6c 50%,#38773b 100%)" },
  { id: 13, x: 364, y: 370, size: 46,  bg: "linear-gradient(145deg,#ffe4c4 0%,#dda570 50%,#9e6b3c 100%)" },
];

const floatingLabels = [
  { text: "How It Fit",        x: 520,  y: 108 },
  { text: "Felt Like This",    x: 470,  y: 148 },
  { text: "The Size Stayed",   x: 510,  y: 188 },
  { text: "Before I Returned", x: 478,  y: 268 },
  { text: "Wear Like This",    x: 488,  y: 308 },
  { text: "Be Confident",      x: 510,  y: 352 },
];

export function FooterSection({ locale }: Props) {
  return (
    <footer className="relative overflow-hidden bg-[#0a0a0a] text-white select-none">

      {/* ── Headline ─────────────────────────────────────────────── */}
      <div className="px-6 pt-14 pb-6 md:px-10">
        <h2
          aria-label={HEADLINE}
          className="font-black leading-none tracking-tight whitespace-nowrap overflow-hidden"
          style={{ fontSize: "clamp(2.4rem, 8.5vw, 9rem)" }}
        >
          {HEADLINE}
        </h2>
      </div>

      {/* ── Main three-column area ──────────────────────────────── */}
      <div className="relative flex min-h-[520px] items-start justify-between px-6 pb-10 md:px-10">

        {/* Left column */}
        <nav className="z-10 flex flex-col gap-1 pt-1 text-sm font-semibold leading-6 text-white/80 min-w-[160px]">
          <span className="text-white/40 text-xs font-normal mb-1 uppercase tracking-widest">Pages</span>
          {[
            { href: `/${locale}/playground`, label: "Playground" },
            { href: `/${locale}/docs`,       label: "Docs" },
            { href: `/${locale}/dashboard`,  label: "Dashboard" },
          ].map(({ href, label }) => (
            <Link key={label} href={href} className="hover:text-white transition-colors">
              {label}
            </Link>
          ))}
          <span className="mt-4 text-white/40 text-xs font-normal uppercase tracking-widest">Features</span>
          {["Try-On", "IKAS App", "Analytics", "Trust"].map((item) => (
            <span key={item} className="cursor-default">{item}</span>
          ))}
          <div className="mt-6 space-y-3 text-xs text-white/55">
            <div>
              <p>General inquiries:</p>
              <a href="mailto:hello@karyamoni.com" className="font-bold text-white hover:text-white/70 transition-colors">
                hello@karyamoni.com
              </a>
            </div>
            <div>
              <p>Partnerships:</p>
              <a href="mailto:partners@karyamoni.com" className="font-bold text-white hover:text-white/70 transition-colors">
                partners@karyamoni.com
              </a>
            </div>
          </div>
        </nav>

        {/* Center: bubble cluster */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative" style={{ width: 500, height: 510 }}>
            {/* Floating text labels */}
            {floatingLabels.map((label) => (
              <span
                key={label.text}
                className="absolute text-[11px] font-semibold text-white/60 whitespace-nowrap"
                style={{ left: label.x, top: label.y, transform: "translateY(-50%)" }}
              >
                {label.text}
              </span>
            ))}

            {/* Spheres */}
            {spheres.map((s) => (
              <div
                key={s.id}
                className="absolute rounded-full overflow-hidden"
                style={{
                  left: s.x,
                  top: s.y,
                  width: s.size,
                  height: s.size,
                  background: s.bg,
                  boxShadow: `inset -${Math.round(s.size * 0.06)}px -${Math.round(s.size * 0.06)}px ${Math.round(s.size * 0.18)}px rgba(0,0,0,0.55), 0 ${Math.round(s.size * 0.06)}px ${Math.round(s.size * 0.25)}px rgba(0,0,0,0.5)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Highlight */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.12) 30%, transparent 62%)",
                  }}
                />
                {/* Edge darkening */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 70% 75%, rgba(0,0,0,0.35) 0%, transparent 55%)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="z-10 flex flex-col items-end gap-1 pt-1 text-sm font-semibold leading-6 text-white/80 text-right min-w-[160px]">
          <span className="text-white/40 text-xs font-normal mb-1 uppercase tracking-widest">Company</span>
          {["About", "Careers", "Blog", "Status"].map((item) => (
            <span key={item} className="cursor-default">{item}</span>
          ))}

          <div className="mt-6 space-y-3 text-xs text-white/55 text-right">
            <div>
              <p>Press:</p>
              <a href="mailto:press@karyamoni.com" className="font-bold text-white hover:text-white/70 transition-colors">
                press@karyamoni.com
              </a>
            </div>
            <div>
              <p>Careers:</p>
              <a href="mailto:careers@karyamoni.com" className="font-bold text-white hover:text-white/70 transition-colors">
                careers@karyamoni.com
              </a>
            </div>
          </div>

          {/* Social icons */}
          <div className="mt-6 flex gap-4 items-center">
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" aria-label="TikTok" className="text-white/60 hover:text-white transition-colors">
              <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#" aria-label="X" className="text-white/60 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────── */}
      <div className="border-t border-white/10 px-6 py-5 md:px-10 grid grid-cols-3 gap-4 text-xs text-white/45">
        <div>
          <p className="text-white/30">Company:</p>
          <p className="text-white/70 font-semibold">Karyamoni</p>
        </div>
        <div className="text-center">
          <p>2026 © All Rights Reserved.</p>
          <p>Design And Development</p>
        </div>
        <div className="text-right">
          <p className="text-white/30">Address:</p>
          <p className="text-white/70 leading-5">Istanbul, Turkey</p>
        </div>
      </div>

      {/* ── Legal links ─────────────────────────────────────────── */}
      <div className="border-t border-white/10 px-6 py-4 md:px-10 flex justify-center gap-10 text-xs text-white/40">
        <Link href={`/${locale}/terms`} className="hover:text-white/70 transition-colors flex items-center gap-1">
          Terms of use <span aria-hidden>↗</span>
        </Link>
        <Link href={`/${locale}/privacy`} className="hover:text-white/70 transition-colors flex items-center gap-1">
          Privacy policy <span aria-hidden>↗</span>
        </Link>
      </div>

      {/* ── Background ghost headline ────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-12 left-0 right-0 overflow-hidden"
        style={{ maskImage: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 100%)" }}
      >
        <p
          className="font-black leading-none tracking-tight whitespace-nowrap text-white opacity-10 blur-[2px]"
          style={{ fontSize: "clamp(3rem, 11vw, 12rem)" }}
        >
          {HEADLINE}
        </p>
      </div>

    </footer>
  );
}

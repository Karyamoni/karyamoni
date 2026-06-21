"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeCheck, Ruler, ScanLine, Shirt, ShoppingCart, Plus, Zap } from "lucide-react";
import type { Locale } from "@/lib/i18n";

// Three.js Canvas — SSR disabled, needs browser WebGL context
const GarmentViewer = dynamic(
  () => import("./GarmentViewer").then((m) => ({ default: m.GarmentViewer })),
  { ssr: false }
);

type Step = { eyebrow: string; title: string; body: string; stat: string };

type CopyData = {
  label: string;
  title: string;
  lead: string;
  productPage: string;
  productName: string;
  size: string;
  tryButton: string;
  fields: string[];
  fieldValues: string[];
  cabinLabel: string;
  cabinTitle: string;
  resultLabels: string[];
  resultValues: string[];
  fitNote: string;
  steps: Step[];
};

type Props = { locale: Locale };

const copy: Record<Locale, CopyData> = {
  tr: {
    label: "Playground akışı",
    title: "Scroll ettikçe IKAS sayfasında ne olduğunu gör.",
    lead: "Hero sadece marka hissini taşır. Playground anlatısı burada başlar: ürün sayfası, profil, kabin ve fit sonucu tek akışta görünür.",
    productPage: "IKAS ürün sayfası",
    productName: "Ribana Dokulu Blazer",
    size: "Beden",
    tryButton: "Karyamoni ile dene",
    fields: ["Boy", "Kilo", "Genel beden", "Göğüs"],
    fieldValues: ["178", "68", "M", "94"],
    cabinLabel: "Kabin modalı",
    cabinTitle: "3D kabin açılır",
    resultLabels: ["Önerilen", "Güven", "Fit"],
    resultValues: ["M", "Yüksek", "Normal"],
    fitNote: "Normal göğüs. Gövde hafif uzun.",
    steps: [
      { eyebrow: "01 / Ürün", title: "Karyamoni girişi beden alanına yerleşir.", body: "Müşteri mağazadan çıkmadan denemeyi başlatır.", stat: "0 yönlendirme" },
      { eyebrow: "02 / Profil", title: "Fit profili hızlı ve kontrollü toplanır.", body: "Boy, kilo, genel beden ve göğüs bilgisi demo akışında tamamlanır.", stat: "4 alan" },
      { eyebrow: "03 / Kabin", title: "Kabin paneli ürün sayfasının üstünde açılır.", body: "Deneme hissi mağazanın içinde kalır, satın alma odağı dağılmaz.", stat: "3D önizleme" },
      { eyebrow: "04 / Sonuç", title: "Sonuç kısa, net ve satın almaya yakındır.", body: "Önerilen beden, güven seviyesi ve fit notu tek ekranda görünür.", stat: "M / yüksek" },
    ],
  },
  en: {
    label: "Playground flow",
    title: "Scroll to see what happens inside the IKAS page.",
    lead: "The hero carries the brand feeling only. The playground narrative starts here: product page, profile, cabin, and fit result in one flow.",
    productPage: "IKAS product page",
    productName: "Ribbed Texture Blazer",
    size: "Size",
    tryButton: "Try with Karyamoni",
    fields: ["Height", "Weight", "Usual size", "Chest"],
    fieldValues: ["178", "68", "M", "94"],
    cabinLabel: "Cabin modal",
    cabinTitle: "3D cabin opens",
    resultLabels: ["Recommended", "Confidence", "Fit"],
    resultValues: ["M", "High", "Regular"],
    fitNote: "Regular chest. Slightly long body.",
    steps: [
      { eyebrow: "01 / Product", title: "The Karyamoni entry sits beside size selection.", body: "The shopper starts try-on without leaving the store.", stat: "0 redirects" },
      { eyebrow: "02 / Profile", title: "Fit profile data is collected quickly.", body: "Height, weight, usual size, and chest inputs complete the demo path.", stat: "4 fields" },
      { eyebrow: "03 / Cabin", title: "The cabin panel opens above the product page.", body: "The try-on moment stays inside the merchant experience.", stat: "3D preview" },
      { eyebrow: "04 / Result", title: "The result is short, clear, and close to purchase.", body: "Recommended size, confidence, and a fit note land in one view.", stat: "M / high" },
    ],
  },
};

export function PlaygroundScrollStory({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const data = copy[locale];

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current || !pinRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const screens = gsap.utils.toArray<HTMLElement>(".story-screen");
      const steps = gsap.utils.toArray<HTMLElement>(".story-step");
      const markers = gsap.utils.toArray<HTMLElement>(".story-marker");

      // opacity (not autoAlpha) — autoAlpha:0 sets visibility:hidden which gives Canvas 0×0 size
      gsap.set(screens.slice(1), { opacity: 0, y: 44, scale: 0.98 });
      gsap.set(steps.slice(1), { autoAlpha: 0.28 });
      gsap.set(markers.slice(1), { scaleX: 0, autoAlpha: 0.28, transformOrigin: "left center" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=5600",
          scrub: 1.5,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(progressRef.current, { scaleX: 1, duration: 4 }, 0);
      tl.to(textRef.current, { y: -28, duration: 4 }, 0);

      screens.forEach((screen, i) => {
        if (i === 0) return;
        const at = i;
        tl
          .to(screens[i - 1], { opacity: 0, y: -44, scale: 0.98, duration: 0.4 }, at)
          .to(screen, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, at + 0.05)
          .to(steps[i - 1], { autoAlpha: 0.28, duration: 0.25 }, at)
          .to(steps[i], { autoAlpha: 1, duration: 0.25 }, at + 0.1)
          .to(markers[i - 1], { scaleX: 0, autoAlpha: 0.28, duration: 0.25 }, at)
          .to(markers[i], { scaleX: 1, autoAlpha: 1, duration: 0.3 }, at + 0.1);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[var(--color-ink)] text-[var(--color-paper)]">
      {/* Custom keyframes for cabin scan + blink + bar fill */}
      <style>{`
        @keyframes k-scan {
          0%   { top: 12%; opacity: 0; }
          8%   { opacity: 1; }
          50%  { top: 82%; }
          92%  { opacity: 1; }
          100% { top: 12%; opacity: 0; }
        }
        @keyframes k-blink { 0%,100% { opacity:1; } 50% { opacity:0.15; } }
        @keyframes k-fillbar { from { width:0% } to { width:94% } }
        @keyframes k-fillbar88 { from { width:0% } to { width:88% } }
        @keyframes k-fillbar92 { from { width:0% } to { width:92% } }
        @keyframes k-fillbar96 { from { width:0% } to { width:96% } }
        .k-scan { position:absolute; inset-x:0; height:2px; animation: k-scan 2.8s ease-in-out infinite; }
        .k-blink { animation: k-blink 1.1s step-end infinite; }
        .k-fillbar   { animation: k-fillbar   1.4s ease-out 0.2s both; }
        .k-fillbar88 { animation: k-fillbar88 1.4s ease-out 0.5s both; }
        .k-fillbar92 { animation: k-fillbar92 1.4s ease-out 0.7s both; }
        .k-fillbar96 { animation: k-fillbar96 1.4s ease-out 0.9s both; }
      `}</style>

      {/* pinRef must be exactly h-screen — no min-h */}
      <div ref={pinRef} className="h-screen overflow-hidden border-b border-white/15">
        <div className="k-grid h-full items-center py-14">

          {/* ── Left: narrative ──────────────────────────────── */}
          <div ref={textRef} className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className="k-label text-white/42">{data.label}</p>
            <h2 className="mt-6 max-w-[9ch] text-5xl font-black uppercase leading-none md:text-6xl lg:text-7xl">
              {data.title}
            </h2>
            <p className="mt-6 max-w-[32rem] text-lg font-bold leading-tight text-white/56">
              {data.lead}
            </p>
            <div className="mt-8 h-px origin-left bg-white/20">
              <div ref={progressRef} className="h-px origin-left scale-x-0 bg-[var(--color-signal)]" />
            </div>
            <div className="mt-6 grid gap-3">
              {data.steps.map((step) => (
                <div
                  key={step.eyebrow}
                  className="story-step grid grid-cols-[80px_1fr] gap-4 border-t border-white/15 pt-3"
                >
                  <div>
                    <p className="k-mono-label text-white/45">{step.eyebrow}</p>
                    <div className="story-marker mt-3 h-1 w-12 origin-left bg-[var(--color-signal)]" />
                  </div>
                  <div>
                    <p className="text-xl font-black uppercase leading-none">{step.title}</p>
                    <p className="mt-2 max-w-md text-xs font-bold uppercase leading-tight text-white/45">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: browser mockup ─────────────────────────── */}
          <div className="relative col-span-4 h-[calc(100vh-7rem)] md:col-span-8 lg:col-span-7">
            <div className="absolute inset-0 overflow-hidden rounded-xl shadow-[0_28px_80px_rgba(0,0,0,0.65)]">

              {/* Browser chrome */}
              <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#1a1a18] px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="ml-2 flex flex-1 items-center gap-2 rounded-md bg-[#2c2c2a] px-3 py-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]" />
                  <span className="font-mono text-xs text-white/28">
                    store.brand.com/products/ribbed-blazer
                  </span>
                </div>
              </div>

              {/* Page area — fixed height relative to chrome */}
              <div className="flex flex-col bg-[#f7f4ef]" style={{ height: "calc(100% - 46px)" }}>

                {/* In-page store nav */}
                <nav className="flex shrink-0 items-center justify-between border-b border-black/[0.07] bg-[#f7f4ef] px-6 py-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.28em] text-[#1a1a18]">
                    {locale === "tr" ? "karyamoni mağaza" : "karyamoni store"}
                  </span>
                  <span className="h-px w-12 bg-black/20" />
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#1a1a18]">
                      {locale === "tr" ? "Alışveriş" : "Shop Now"}
                    </span>
                    <ShoppingCart size={12} className="text-[#1a1a18]" />
                  </div>
                </nav>

                {/* Screens stack — relative flex-1 gives defined height for absolute children */}
                <div className="relative flex-1 overflow-hidden">
                  <StoryScreen className="story-screen">
                    <ProductScreen data={data} locale={locale} />
                  </StoryScreen>
                  <StoryScreen className="story-screen">
                    <ProfileScreen data={data} locale={locale} />
                  </StoryScreen>
                  <StoryScreen className="story-screen">
                    <CabinScreen data={data} locale={locale} />
                  </StoryScreen>
                  <StoryScreen className="story-screen">
                    <ResultScreen data={data} locale={locale} />
                  </StoryScreen>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function StoryScreen({ className, children }: { className: string; children: React.ReactNode }) {
  return <div className={`${className} absolute inset-0`}>{children}</div>;
}

/* ─────────────────────────────────────────────────────
   Screen 1 — Product page (Odd Ritual reference style)
───────────────────────────────────────────────────── */
function ProductScreen({ data, locale }: { data: CopyData; locale: Locale }) {
  return (
    <div className="grid h-full grid-cols-[1.05fr_0.95fr]">
      {/* Left: 3D model on cream bg */}
      <div className="relative overflow-hidden bg-[#ede8df]">
        <GarmentViewer mode="product" />

        {/* AI Fit badge */}
        <div className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-2.5 py-1 backdrop-blur-sm">
          <Zap size={9} className="text-[var(--color-signal)]" />
          <span className="text-[8px] font-black uppercase tracking-wider text-[#1a1a18]">AI Fit</span>
        </div>

        {/* Caption */}
        <p className="pointer-events-none absolute bottom-4 left-5 z-10 text-[8px] font-bold uppercase tracking-widest text-black/22">
          {data.productPage}
        </p>
      </div>

      {/* Right: product details */}
      <div className="flex flex-col border-l border-black/[0.07] bg-white">
        {/* Name + price */}
        <div className="flex items-start justify-between border-b border-black/[0.06] p-5">
          <div>
            <p className="mb-2 text-[8px] uppercase tracking-[0.24em] text-black/28">
              {locale === "tr" ? "Koleksiyon 01 · Sınırlı seri" : "Collection 01 · Limited drop"}
            </p>
            <p className="text-sm font-black uppercase leading-snug text-[#1a1a18]">{data.productName}</p>
          </div>
          <p className="text-sm font-black text-[#1a1a18]">1.890 TL</p>
        </div>

        {/* Description */}
        <div className="border-b border-black/[0.06] px-5 py-3.5">
          <p className="text-[10px] leading-relaxed text-black/38">
            {locale === "tr"
              ? "Rahat kesim, premium ribana doku. Yapılandırılmış omuz. Yerel üretim."
              : "Relaxed cut, premium ribbed texture. Structured shoulder. Locally made."}
          </p>
        </div>

        {/* Accordions */}
        {[
          locale === "tr" ? "Ürün Detayları" : "Garment Details",
          locale === "tr" ? "Yıkama Talimatı" : "Wash Care",
        ].map((label) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3.5"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1a1a18]">{label}</p>
            <Plus size={11} className="text-[#1a1a18]" strokeWidth={2} />
          </div>
        ))}

        <div className="flex-1" />

        {/* Size + CTAs */}
        <div className="space-y-2.5 border-t border-black/[0.06] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1a1a18]">{data.size}</p>
            <Plus size={11} className="text-[#1a1a18]" strokeWidth={2} />
          </div>

          <div className="grid grid-cols-5 border border-black/[0.12]">
            {["XS", "S", "M", "L", "XL"].map((s) => (
              <div
                key={s}
                className={`grid min-h-9 place-items-center border-r border-black/[0.12] text-[9px] font-black last:border-r-0 ${
                  s === "M"
                    ? "bg-[#1a1a18] text-white outline outline-1 outline-[var(--color-signal)]"
                    : "text-[#1a1a18]"
                }`}
              >
                {s}
              </div>
            ))}
          </div>

          {/* Karyamoni CTA */}
          <div className="flex items-center justify-between bg-[var(--color-signal)] px-4 py-2.5">
            <p className="text-[9px] font-black uppercase tracking-wider text-[var(--color-ink)]">
              {data.tryButton}
            </p>
            <Shirt size={12} className="text-[var(--color-ink)]" aria-hidden />
          </div>

          {/* Add to cart */}
          <div className="flex items-center justify-center bg-[#1a1a18] px-4 py-2.5">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white">
              {locale === "tr" ? "Sepete Ekle" : "Add to Cart"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Screen 2 — Fit profile (body diagram + data)
───────────────────────────────────────────────────── */
function ProfileScreen({ data, locale }: { data: CopyData; locale: Locale }) {
  return (
    <div className="grid h-full grid-cols-[0.75fr_1.25fr]">
      {/* Left: 3D model on dark bg */}
      <div className="relative overflow-hidden bg-[#1a1a18]">
        {/* Subtle grid behind model */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* 3D garment rotating on dark bg */}
        <GarmentViewer mode="profile" />

        {/* Measurement overlay — height bracket left */}
        <div className="pointer-events-none absolute inset-y-10 left-4 z-20 flex flex-col items-center">
          <div className="h-1.5 w-1.5 border-l-2 border-t-2 border-[var(--color-signal)]/50" />
          <div className="flex-1 w-px bg-[var(--color-signal)]/25" />
          <div className="h-1.5 w-1.5 border-b-2 border-l-2 border-[var(--color-signal)]/50" />
        </div>
        <div className="pointer-events-none absolute left-2 top-1/2 z-20 -translate-y-1/2 -rotate-90">
          <p className="whitespace-nowrap text-[7px] font-bold uppercase tracking-wider text-[var(--color-signal)]/50">
            178 CM
          </p>
        </div>

        {/* Chest bracket right */}
        <div className="pointer-events-none absolute right-4 top-[34%] z-20 flex h-[20%] flex-col items-center">
          <div className="h-1.5 w-1.5 border-r-2 border-t-2 border-[var(--color-signal)]/50" />
          <div className="flex-1 w-px bg-[var(--color-signal)]/25" />
          <div className="h-1.5 w-1.5 border-b-2 border-r-2 border-[var(--color-signal)]/50" />
        </div>
        <div className="pointer-events-none absolute right-2 top-[42%] z-20">
          <p className="text-[7px] font-bold uppercase tracking-wider text-[var(--color-signal)]/50">94</p>
        </div>

        {/* Corner brackets HUD */}
        <div className="pointer-events-none absolute left-3 top-3 z-20 h-5 w-5 border-l-2 border-t-2 border-[var(--color-signal)]/30" />
        <div className="pointer-events-none absolute right-3 top-3 z-20 h-5 w-5 border-r-2 border-t-2 border-[var(--color-signal)]/30" />
        <div className="pointer-events-none absolute bottom-3 left-3 z-20 h-5 w-5 border-b-2 border-l-2 border-[var(--color-signal)]/30" />
        <div className="pointer-events-none absolute bottom-3 right-3 z-20 h-5 w-5 border-b-2 border-r-2 border-[var(--color-signal)]/30" />

        <p className="pointer-events-none absolute bottom-4 left-0 right-0 z-20 text-center text-[8px] font-bold uppercase tracking-widest text-white/22">
          Fit Profile
        </p>
      </div>

      {/* Right: measurement data */}
      <div className="flex flex-col bg-[#f7f4ef]">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-2 border-b border-black/[0.07] px-5 py-3.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]" />
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-signal)]">
            Karyamoni — Fit Profile
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-1 flex-col divide-y divide-black/[0.06]">
          {data.fields.map((field, i) => (
            <div key={field} className="flex flex-1 items-center justify-between px-5">
              <div>
                <p className="text-[8px] uppercase tracking-[0.22em] text-black/28">{field}</p>
                <p className="mt-1 text-[2.2rem] font-black leading-none text-[#1a1a18]">
                  {data.fieldValues[i]}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Ruler size={16} className="text-[var(--color-signal)]" aria-hidden />
                {/* Check pill */}
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-signal)]">
                  <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white" strokeWidth="2">
                    <path d="M1 4l3 3 5-6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress footer */}
        <div className="shrink-0 border-t border-black/[0.07] px-5 py-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-bold uppercase tracking-wider text-black/28">
              {locale === "tr" ? "Tamamlandı" : "Complete"}
            </p>
            <p className="text-[9px] font-black text-[var(--color-signal)]">4 / 4</p>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/[0.06]">
            <div className="h-1 w-full rounded-full bg-[var(--color-signal)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Screen 3 — Cabin (3D garment + HUD)
───────────────────────────────────────────────────── */
function CabinScreen({ data, locale }: { data: CopyData; locale: Locale }) {
  return (
    <div className="relative h-full overflow-hidden bg-[#0c1a10]">
      {/* Ambient grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* 3D garment — fills background */}
      <GarmentViewer mode="cabin" />

      {/* CSS scan beam overlay on top of canvas */}
      <div
        className="k-scan pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg,transparent 0%,var(--color-signal) 40%,var(--color-signal) 60%,transparent 100%)",
          boxShadow:
            "0 0 14px 3px var(--color-signal), 0 0 40px 6px rgba(240,68,31,0.25)",
          opacity: 0.55,
        }}
      />

      {/* Corner HUD brackets */}
      {(["left-5 top-16", "right-5 top-16", "left-5 bottom-16", "right-5 bottom-16"] as const).map(
        (pos, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute ${pos} h-7 w-7 border-[var(--color-signal)]/30 ${
              i === 0 ? "border-l-2 border-t-2"
              : i === 1 ? "border-r-2 border-t-2"
              : i === 2 ? "border-b-2 border-l-2"
              :           "border-b-2 border-r-2"
            }`}
          />
        )
      )}

      {/* Top-left: label */}
      <div className="pointer-events-none absolute left-5 top-5">
        <p className="text-[8px] font-bold uppercase tracking-widest text-white/28">
          {data.cabinLabel}
        </p>
        <p className="mt-1 text-2xl font-black uppercase leading-none text-[var(--color-signal)]">
          {data.cabinTitle}
        </p>
      </div>

      {/* Top-right: scanning status */}
      <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-2">
        <div className="k-blink h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]" />
        <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--color-signal)]">
          {locale === "tr" ? "Taranıyor..." : "Scanning..."}
        </p>
      </div>

      {/* Bottom: measurement readout HUD */}
      <div className="pointer-events-none absolute bottom-5 left-5 right-5">
        <div className="grid grid-cols-4 gap-2 border border-[var(--color-signal)]/15 bg-black/50 p-3 backdrop-blur-sm">
          {[
            { label: locale === "tr" ? "Boy"    : "Height", value: "178"  },
            { label: locale === "tr" ? "Göğüs"  : "Chest",  value: "94"   },
            { label: locale === "tr" ? "Beden"  : "Size",   value: "M"    },
            { label: locale === "tr" ? "Eşleşme": "Match",  value: "94%"  },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-[7px] uppercase tracking-widest text-white/28">{label}</p>
              <p className="mt-1 text-sm font-black text-[var(--color-signal)]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ScanLine icon bottom-right */}
      <ScanLine
        className="absolute bottom-[72px] right-5 text-[var(--color-signal)]/30"
        size={36}
        aria-hidden
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Screen 4 — Fit result (data-rich)
───────────────────────────────────────────────────── */
function ResultScreen({ data, locale }: { data: CopyData; locale: Locale }) {
  return (
    <div className="flex h-full flex-col bg-[#f7f4ef]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-black/[0.07] px-5 py-3.5">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]" />
        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-signal)]">
          Karyamoni — {locale === "tr" ? "Fit Sonucu" : "Fit Result"}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-5">
        {/* Big size + confidence label */}
        <div className="flex items-center gap-4">
          <p className="text-[5.5rem] font-black leading-none text-[#1a1a18]">M</p>
          <div className="flex flex-col gap-1">
            <p className="text-[8px] uppercase tracking-[0.22em] text-black/28">
              {locale === "tr" ? "Önerilen beden" : "Recommended size"}
            </p>
            <p className="text-xs font-black uppercase text-[var(--color-signal)]">
              {locale === "tr" ? "Yüksek güven — 94%" : "High confidence — 94%"}
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[8px] uppercase tracking-wider text-black/28">
              {locale === "tr" ? "Güven skoru" : "Confidence score"}
            </p>
            <p className="text-[9px] font-black text-[#1a1a18]">94%</p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
            <div
              className="k-fillbar h-1.5 rounded-full bg-[var(--color-signal)]"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-2">
          {data.resultLabels.map((label, i) => (
            <div key={label} className="border border-black/[0.08] bg-white p-3">
              <p className="text-[7px] uppercase tracking-[0.22em] text-black/28">{label}</p>
              <p className="mt-2 text-xl font-black uppercase text-[#1a1a18]">{data.resultValues[i]}</p>
            </div>
          ))}
        </div>

        {/* Body breakdown bars */}
        <div className="space-y-2.5">
          {[
            { label: locale === "tr" ? "Omuz" : "Shoulder",  pct: 96, cls: "k-fillbar96" },
            { label: locale === "tr" ? "Göğüs" : "Chest",    pct: 92, cls: "k-fillbar92" },
            { label: locale === "tr" ? "Bel" : "Waist",      pct: 88, cls: "k-fillbar88" },
          ].map(({ label, pct, cls }) => (
            <div key={label} className="flex items-center gap-3">
              <p className="w-12 shrink-0 text-[8px] uppercase tracking-wider text-black/28">{label}</p>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className={`${cls} h-1 rounded-full bg-[var(--color-signal)]/50`}
                  style={{ width: "0%" }}
                />
              </div>
              <p className="w-6 text-right text-[8px] font-black text-black/35">{pct}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: fit note + add to cart */}
      <div className="shrink-0 border-t border-black/[0.07] p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <p className="text-xs font-black uppercase leading-snug text-[var(--color-signal)]">
            {data.fitNote}
          </p>
          <BadgeCheck size={20} className="shrink-0 text-[var(--color-signal)]" aria-hidden />
        </div>
        <div className="flex items-center justify-between bg-[#1a1a18] px-4 py-3">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
            {locale === "tr" ? "M Beden Sepete Ekle" : "Add Size M to Cart"}
          </p>
          <span className="text-xs font-black text-[var(--color-signal)]">→</span>
        </div>
      </div>
    </div>
  );
}

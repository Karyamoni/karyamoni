"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Ruler, ScanLine, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { PlaygroundScrollStory } from "@/components/landing/PlaygroundScrollStory";
import { HeroStatueCanvas } from "@/components/visuals/HeroStatueCanvas";
import { FooterSection } from "@/components/landing/FooterSection";
import { PhilosophyScroll } from "@/components/landing/PhilosophyScroll";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";

type Props = {
  locale: Locale;
  content: SiteContent;
};

const ease = [0.16, 1, 0.3, 1] as const;

const landingUi = {
  tr: {
    modelCredit: "3D model: pouriaoskuie11 / CC-BY-4.0",
    heroKicker: "Hellenistik form. Modern commerce.",
    heroLine: "Try on without returns",
    scroll: "Kaydır",
    productPosition: "Ürün konumu",
    systemRail: "Sistem rayı",
    sceneCaption: "Ürün sayfası, deneme kabini, dashboard sinyali."
  },
  en: {
    modelCredit: "3D model: pouriaoskuie11 / CC-BY-4.0",
    heroKicker: "Hellenistic form. Modern commerce.",
    heroLine: "Try on without returns",
    scroll: "Scroll",
    productPosition: "Product position",
    systemRail: "System rail",
    sceneCaption: "Product page, fitting cabin, dashboard signal."
  }
};

export function EditorialLanding({ locale, content }: Props) {
  const ui = landingUi[locale];

  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <SiteHeader locale={locale} />

      <section className="relative min-h-[92svh] overflow-hidden border-b k-hairline pt-16">
        <div className="absolute bottom-0 right-0 top-16 w-full md:w-[58vw]">
          <HeroStatueCanvas />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 top-16 hidden w-[58vw] border-l k-hairline md:block" />

        <div className="k-grid relative z-10 min-h-[calc(92svh-4rem)] content-between py-5 md:py-7">
          <div className="col-span-4 flex items-start justify-between md:col-span-8 lg:col-span-12">
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="k-label max-w-[220px]"
            >
              {content.home.badge}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease }}
              className="hidden max-w-[310px] text-right text-sm font-bold leading-tight text-[var(--color-ink-soft)] lg:block"
            >
              {content.home.lead}
            </motion.p>
          </div>

          <div className="relative col-span-4 max-w-[760px] md:col-span-7 lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.9, ease }}
              className="mb-5 max-w-[16rem] text-sm font-black uppercase leading-none text-[var(--color-signal)]"
            >
              {ui.heroKicker}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 1, ease }}
              className="k-display-wide pointer-events-none relative z-10 max-w-[9ch]"
            >
              Karyamoni
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 1, ease }}
              className="mt-5 max-w-[11ch] text-5xl font-black uppercase leading-none md:text-7xl lg:text-8xl"
            >
              {ui.heroLine}
            </motion.p>
          </div>

          <div className="col-span-4 grid gap-4 md:col-span-8 md:grid-cols-[1fr_auto_auto] md:items-end lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.8, ease }}
              className="flex flex-wrap gap-3"
            >
              <Link className="k-button k-button-dark" href={`/${locale}/playground`}>
                {content.home.primary}
                <ArrowUpRight className="ml-2" size={17} aria-hidden />
              </Link>
              <Link className="k-button" href={`/${locale}/docs`}>
                {content.home.secondary}
              </Link>
            </motion.div>
            <p className="k-mono-label hidden max-w-[230px] text-[var(--color-ink-soft)] md:block">{ui.modelCredit}</p>
            <p className="k-label hidden md:block">{ui.scroll}</p>
            <ArrowDown className="hidden md:block" size={26} aria-hidden />
          </div>
        </div>
      </section>

      <PlaygroundScrollStory locale={locale} />

      <section className="border-b k-hairline">
        <div className="k-grid py-8 md:py-12">
          <p className="k-label col-span-4 md:col-span-2">{ui.productPosition}</p>
          <h2 className="k-section-title col-span-4 md:col-span-6 lg:col-span-7">
            {content.home.closingTitle}
          </h2>
          <p className="k-body col-span-4 text-xl md:col-span-4 md:text-2xl lg:col-span-3">
            {content.home.closingBody}
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="k-grid border-b border-white/15 py-4">
          <p className="k-label col-span-4 md:col-span-2">{ui.systemRail}</p>
          <nav className="col-span-4 flex gap-3 overflow-auto md:col-span-6 lg:col-span-10">
            {content.home.rail.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="shrink-0 rounded-full border border-white/25 px-4 py-3 text-sm font-black uppercase text-white/65 transition-colors hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {content.home.features.map((feature, index) => (
          <motion.article
            key={feature.id}
            id={feature.eyebrow.toLowerCase().replace(/\s+/g, "-")}
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.8, ease }}
            className="border-b border-white/15"
          >
            <div className="k-grid min-h-[620px] py-6 md:py-8">
              <div className="col-span-4 flex flex-col justify-between md:col-span-2">
                <p className="k-label text-white/45">0{index + 1} / {feature.eyebrow}</p>
                <p className="hidden text-6xl font-black uppercase leading-none text-white/20 md:block">{feature.stat}</p>
              </div>
              <div className="col-span-4 md:col-span-6 lg:col-span-5">
                <h3 className="k-section-title">{feature.title}</h3>
                <p className="mt-6 max-w-2xl text-xl font-bold leading-tight text-white/58 md:text-2xl">{feature.body}</p>
              </div>
              <div className="col-span-4 md:col-span-8 lg:col-span-5">
                <FeatureScene index={index} label={feature.accent} stat={feature.stat} caption={ui.sceneCaption} />
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <PhilosophyScroll />
      <FooterSection locale={locale} />
    </main>
  );
}

function FeatureScene({ index, label, stat, caption }: { index: number; label: string; stat: string; caption: string }) {
  const isBlue = index % 3 === 1;
  const isPaper = index % 3 === 2;

  return (
    <div
      className={[
        "relative min-h-[420px] overflow-hidden border p-4",
        isBlue ? "border-white/20 bg-[var(--color-cobalt)]" : isPaper ? "border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)]" : "border-white/20 bg-[var(--color-green)]"
      ].join(" ")}
    >
      <p className="k-label relative z-10">{label}</p>
      <div className="absolute inset-x-4 top-16 border-t border-current opacity-35" />
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <p className="max-w-[9ch] break-words text-6xl font-black uppercase leading-none md:text-7xl xl:text-8xl">{stat}</p>
          <p className="mt-3 max-w-[18rem] text-sm font-bold uppercase opacity-60">
            {caption}
          </p>
        </div>
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border border-current md:h-28 md:w-28">
          {index % 3 === 0 ? <ScanLine size={42} /> : index % 3 === 1 ? <Ruler size={42} /> : <ShieldCheck size={42} />}
        </div>
      </div>
      <div className="absolute right-8 top-24 h-40 w-28 border border-current bg-current opacity-10" />
      <div className="absolute right-20 top-44 h-40 w-28 border border-current bg-current opacity-20" />
      <ArrowRight className="absolute bottom-8 right-40 opacity-60" size={42} aria-hidden />
    </div>
  );
}

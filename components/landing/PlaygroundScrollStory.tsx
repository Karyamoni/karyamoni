"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BadgeCheck, Ruler, ScanLine, Shirt } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type Step = {
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
};

type Props = {
  locale: Locale;
};

const copy: Record<
  Locale,
  {
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
  }
> = {
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
      {
        eyebrow: "01 / Ürün",
        title: "Karyamoni girişi beden alanına yerleşir.",
        body: "Müşteri mağazadan çıkmadan denemeyi başlatır.",
        stat: "0 yönlendirme"
      },
      {
        eyebrow: "02 / Profil",
        title: "Fit profili hızlı ve kontrollü toplanır.",
        body: "Boy, kilo, genel beden ve göğüs bilgisi demo akışında tamamlanır.",
        stat: "4 alan"
      },
      {
        eyebrow: "03 / Kabin",
        title: "Kabin paneli ürün sayfasının üstünde açılır.",
        body: "Deneme hissi mağazanın içinde kalır, satın alma odağı dağılmaz.",
        stat: "3D önizleme"
      },
      {
        eyebrow: "04 / Sonuç",
        title: "Sonuç kısa, net ve satın almaya yakındır.",
        body: "Önerilen beden, güven seviyesi ve fit notu tek ekranda görünür.",
        stat: "M / yüksek"
      }
    ]
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
      {
        eyebrow: "01 / Product",
        title: "The Karyamoni entry sits beside size selection.",
        body: "The shopper starts try-on without leaving the store.",
        stat: "0 redirects"
      },
      {
        eyebrow: "02 / Profile",
        title: "Fit profile data is collected quickly.",
        body: "Height, weight, usual size, and chest inputs complete the demo path.",
        stat: "4 fields"
      },
      {
        eyebrow: "03 / Cabin",
        title: "The cabin panel opens above the product page.",
        body: "The try-on moment stays inside the merchant experience.",
        stat: "3D preview"
      },
      {
        eyebrow: "04 / Result",
        title: "The result is short, clear, and close to purchase.",
        body: "Recommended size, confidence, and a fit note land in one view.",
        stat: "M / high"
      }
    ]
  }
};

export function PlaygroundScrollStory({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const data = copy[locale];

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current || !pinRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const screens = gsap.utils.toArray<HTMLElement>(".story-screen");
      const steps = gsap.utils.toArray<HTMLElement>(".story-step");
      const markers = gsap.utils.toArray<HTMLElement>(".story-marker");

      gsap.set(screens.slice(1), { autoAlpha: 0, y: 34, scale: 0.96 });
      gsap.set(steps.slice(1), { autoAlpha: 0.34 });
      gsap.set(markers.slice(1), { scaleX: 0.2, autoAlpha: 0.34, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3200",
          scrub: 0.8,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      timeline.to(progressRef.current, { scaleX: 1, duration: 4 }, 0);

      screens.forEach((screen, index) => {
        if (index === 0) {
          timeline.to(screen, { y: -12, duration: 1 }, 0);
          return;
        }

        timeline
          .to(screens[index - 1], { autoAlpha: 0, y: -34, scale: 0.96, duration: 0.32 }, index)
          .to(screen, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42 }, index + 0.05)
          .to(steps[index - 1], { autoAlpha: 0.34, duration: 0.2 }, index)
          .to(steps[index], { autoAlpha: 1, duration: 0.2 }, index + 0.08)
          .to(markers[index - 1], { scaleX: 0.2, autoAlpha: 0.34, duration: 0.2 }, index)
          .to(markers[index], { scaleX: 1, autoAlpha: 1, duration: 0.24 }, index + 0.08);
      });

      timeline.to(textRef.current, { y: -24, duration: 4 }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div ref={pinRef} className="min-h-screen overflow-hidden border-b border-white/15">
        <div className="k-grid min-h-screen items-center py-20">
          <div ref={textRef} className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className="k-label text-white/42">{data.label}</p>
            <h2 className="mt-8 max-w-[9ch] text-6xl font-black uppercase leading-none md:text-7xl lg:text-8xl">{data.title}</h2>
            <p className="mt-8 max-w-[34rem] text-xl font-bold leading-tight text-white/56 md:text-2xl">
              {data.lead}
            </p>
            <div className="mt-10 h-px origin-left bg-white/20">
              <div ref={progressRef} className="h-px origin-left scale-x-0 bg-[var(--color-signal)]" />
            </div>
            <div className="mt-8 grid gap-4">
              {data.steps.map((step) => (
                <div key={step.eyebrow} className="story-step grid grid-cols-[90px_1fr] gap-4 border-t border-white/15 pt-4">
                  <div>
                    <p className="k-mono-label text-white/45">{step.eyebrow}</p>
                    <div className="story-marker mt-4 h-1 w-14 origin-left bg-[var(--color-signal)]" />
                  </div>
                  <div>
                    <p className="text-2xl font-black uppercase leading-none">{step.title}</p>
                    <p className="mt-3 max-w-md text-sm font-bold uppercase leading-tight text-white/45">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative col-span-4 min-h-[620px] md:col-span-8 lg:col-span-7">
            <div className="absolute inset-0 border border-white/18 bg-[#0e0e0b]">
              <div className="grid grid-cols-[1fr_auto] border-b border-white/15 p-4">
                <div>
                  <p className="k-mono-label text-white/42">{data.productPage}</p>
                  <p className="mt-1 text-2xl font-black uppercase leading-none">{data.productName}</p>
                </div>
                <p className="text-2xl font-black uppercase leading-none">1.890 TL</p>
              </div>

              <StoryScreen className="story-screen">
                <div className="grid h-full md:grid-cols-[1fr_0.9fr]">
                  <ProductSilhouette />
                  <div className="flex flex-col justify-between border-l border-white/15 p-5">
                    <div>
                      <p className="k-label text-white/45">{data.size}</p>
                      <div className="mt-4 grid grid-cols-5 border border-white/20">
                        {["XS", "S", "M", "L", "XL"].map((size) => (
                          <div key={size} className="grid min-h-14 place-items-center border-r border-white/20 text-lg font-black last:border-r-0">
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid min-h-16 grid-cols-[1fr_auto] items-center rounded-full bg-[var(--color-paper)] px-6 text-[var(--color-ink)]">
                      <p className="font-black uppercase">{data.tryButton}</p>
                      <Shirt size={20} aria-hidden />
                    </div>
                  </div>
                </div>
              </StoryScreen>

              <StoryScreen className="story-screen">
                <div className="grid h-full place-items-center p-6">
                  <div className="w-full max-w-[560px] border border-white/20">
                    {data.fields.map((field, index) => (
                      <div key={field} className="grid grid-cols-[1fr_auto] border-b border-white/20 p-5 last:border-b-0">
                        <div>
                          <p className="k-mono-label text-white/42">{field}</p>
                          <p className="mt-5 text-5xl font-black uppercase leading-none">{data.fieldValues[index]}</p>
                        </div>
                        <Ruler className="text-[var(--color-signal)]" size={28} aria-hidden />
                      </div>
                    ))}
                  </div>
                </div>
              </StoryScreen>

              <StoryScreen className="story-screen">
                <div className="grid h-full md:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative overflow-hidden bg-[var(--color-green)]">
                    <div className="absolute left-1/2 top-16 h-[340px] w-[210px] -translate-x-1/2 rounded-t-[140px] bg-[#d6c3ad]" />
                    <div className="absolute left-1/2 top-36 h-[250px] w-[300px] -translate-x-1/2 bg-[var(--color-signal)]" />
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-[var(--color-paper)]" />
                    <ScanLine className="absolute bottom-8 right-8 text-[var(--color-cobalt)]" size={74} aria-hidden />
                  </div>
                  <div className="flex flex-col justify-between border-l border-white/15 p-5">
                    <p className="k-label text-white/45">{data.cabinLabel}</p>
                    <p className="text-6xl font-black uppercase leading-none text-[var(--color-signal)]">{data.cabinTitle}</p>
                  </div>
                </div>
              </StoryScreen>

              <StoryScreen className="story-screen">
                <div className="grid h-full place-items-center p-6">
                  <div className="w-full max-w-[650px]">
                    <div className="grid border border-white/20 md:grid-cols-3">
                      <Result label={data.resultLabels[0]} value={data.resultValues[0]} />
                      <Result label={data.resultLabels[1]} value={data.resultValues[1]} />
                      <Result label={data.resultLabels[2]} value={data.resultValues[2]} />
                    </div>
                    <div className="mt-8 grid grid-cols-[1fr_auto] items-center gap-5 border-t border-white/15 pt-8">
                      <p className="text-4xl font-black uppercase leading-none text-[var(--color-signal)]">
                        {data.fitNote}
                      </p>
                      <BadgeCheck size={42} aria-hidden />
                    </div>
                  </div>
                </div>
              </StoryScreen>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryScreen({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div className={`${className} absolute inset-x-0 bottom-0 top-[73px]`}>
      {children}
    </div>
  );
}

function ProductSilhouette() {
  return (
    <div className="relative overflow-hidden bg-[#e7e0d3]">
      <div className="absolute left-1/2 top-20 h-[330px] w-[210px] -translate-x-1/2 rounded-t-[140px] bg-[var(--color-ink)]" />
      <div className="absolute left-1/2 top-40 h-[240px] w-[300px] -translate-x-1/2 bg-[var(--color-signal)]" />
      <div className="absolute left-1/2 top-52 h-[185px] w-[210px] -translate-x-1/2 border border-[var(--color-paper)] bg-[var(--color-paper)]" />
      <p className="absolute bottom-5 left-5 text-6xl font-black uppercase leading-none text-[var(--color-ink)]">Fit / M</p>
      <ArrowRight className="absolute bottom-8 right-8 text-[var(--color-ink)]" size={38} aria-hidden />
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/20 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="k-mono-label text-white/42">{label}</p>
      <p className="mt-14 text-6xl font-black uppercase leading-none">{value}</p>
    </div>
  );
}

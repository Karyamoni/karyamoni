"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Ruler, Save, Shirt } from "lucide-react";
import CabinCanvas from "@/components/visuals/CabinCanvas";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";

type Props = {
  locale: Locale;
  content: SiteContent;
  isAuthenticated: boolean;
};

type Step = "product" | "profile" | "cabin" | "result";

const stepLabels: Step[] = ["product", "profile", "cabin", "result"];

const playgroundUi = {
  tr: {
    guided: "Yönlendirmeli demo",
    demoStore: "IKAS demo mağazası",
    steps: {
      product: "Ürün",
      profile: "Profil",
      cabin: "Kabin",
      result: "Sonuç"
    },
    productIntro: "Giriş, beden seçiminin yanında görünür. Ayrı bir hedef değil, mağazanın yerel parçası gibi hissedilir.",
    continue: "Devam et",
    fields: ["Boy", "Kilo", "Genel beden", "Göğüs"],
    demoPlaceholder: "Demo",
    continueToCabin: "Kabine geç",
    showResult: "Fit sonucunu göster",
    recommended: "Önerilen",
    confidence: "Güven",
    fit: "Fit",
    confidenceValue: "Yüksek",
    fitValue: "Normal",
    fitNote: "Beklenen fit: göğüs çevresinde normal, gövde boyu hafif uzun."
  },
  en: {
    guided: "Guided demo",
    demoStore: "IKAS demo store",
    steps: {
      product: "Product",
      profile: "Profile",
      cabin: "Cabin",
      result: "Result"
    },
    productIntro: "The entry appears beside size selection. It feels native to the store, not like a separate destination.",
    continue: "Continue",
    fields: ["Height", "Weight", "Usual size", "Chest"],
    demoPlaceholder: "Demo",
    continueToCabin: "Continue to cabin",
    showResult: "Show fit result",
    recommended: "Recommended",
    confidence: "Confidence",
    fit: "Fit",
    confidenceValue: "High",
    fitValue: "Regular",
    fitNote: "Expected fit: regular around chest, slightly long body length."
  }
} satisfies Record<Locale, Record<string, unknown>>;

export function PlaygroundDemo({ locale, content, isAuthenticated }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("product");
  const sizes = useMemo(() => ["XS", "S", "M", "L", "XL"], []);
  const ui = playgroundUi[locale];

  function saveProgress() {
    if (!isAuthenticated) {
      router.push(`/${locale}/login?next=/${locale}/playground`);
      return;
    }

    setStep("result");
  }

  return (
    <main className="min-h-screen bg-[var(--color-paper)] pt-16 text-[var(--color-ink)]">
      <section className="border-b k-hairline">
        <div className="k-grid min-h-[360px] content-between py-6 md:py-8">
          <p className="k-label col-span-4 md:col-span-2">{ui.guided}</p>
          <h1 className="k-display col-span-4 md:col-span-6 lg:col-span-7">{content.playground.title}</h1>
          <p className="k-body col-span-4 text-xl md:col-span-4 md:text-2xl lg:col-span-3">{content.playground.lead}</p>
        </div>
      </section>

      <section className="k-grid py-4 md:py-6">
        <div className="col-span-4 border border-[var(--color-ink)] bg-[var(--color-paper)] md:col-span-8 lg:col-span-7">
          <div className="grid grid-cols-[1fr_auto] border-b border-[var(--color-ink)] p-3">
            <div>
              <p className="k-mono-label text-[var(--color-ink-soft)]">{ui.demoStore}</p>
              <h2 className="mt-1 text-2xl font-black uppercase leading-none">{content.playground.productName}</h2>
            </div>
            <p className="text-2xl font-black uppercase">{content.playground.price}</p>
          </div>

          <div className="grid md:min-h-[620px] md:grid-cols-[1.1fr_0.9fr]">
            <div className="grid min-h-[340px] place-items-center border-b border-[var(--color-ink)] bg-[#e7e0d3] p-4 md:min-h-[620px] md:border-b-0 md:border-r md:p-6">
              <div className="relative h-[320px] w-[230px] md:h-[460px] md:w-[300px]">
                <div className="absolute left-1/2 top-4 h-[250px] w-[160px] -translate-x-1/2 rounded-t-[110px] bg-[var(--color-ink)] md:h-[360px] md:w-[220px] md:rounded-t-[140px]" />
                <div className="absolute left-1/2 top-20 h-[170px] w-[210px] -translate-x-1/2 bg-[var(--color-signal)] md:top-24 md:h-[250px] md:w-[260px]" />
                <div className="absolute left-1/2 top-28 h-[145px] w-[150px] -translate-x-1/2 border border-[var(--color-paper)] bg-[var(--color-paper)] md:top-32 md:h-[210px] md:w-[190px]" />
                <p className="absolute bottom-0 left-0 right-0 text-center text-4xl font-black uppercase leading-none md:text-5xl">
                  FIT / M
                </p>
              </div>
            </div>

            <div className="flex min-h-[220px] flex-col justify-between p-4 md:min-h-[460px]">
              <div>
                <p className="k-label mb-4">{content.playground.sizeLabel}</p>
                <div className="grid grid-cols-5 border border-[var(--color-ink)]">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className="min-h-16 border-r border-[var(--color-ink)] text-lg font-black uppercase transition-colors last:border-r-0 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => setStep("profile")} className="k-button k-button-dark w-full">
                <Shirt className="mr-2" size={18} aria-hidden />
                {content.playground.start}
              </button>
            </div>
          </div>
        </div>

        <aside className="col-span-4 border border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] md:col-span-8 lg:col-span-5">
          <div className="grid grid-cols-4 border-b border-white/15">
            {stepLabels.map((item) => (
              <button
                key={item}
                onClick={() => setStep(item)}
                className={`min-h-14 border-r border-white/15 text-xs font-black uppercase last:border-r-0 ${
                  step === item ? "bg-[var(--color-paper)] text-[var(--color-ink)]" : "text-white/55 hover:text-white"
                }`}
              >
                {ui.steps[item]}
              </button>
            ))}
          </div>

          <div className="min-h-[500px] p-5 md:min-h-[620px]">
            {step === "product" && (
              <Panel title={content.playground.start} icon={<Shirt size={22} />}>
                <p className="max-w-xl text-2xl font-black uppercase leading-tight text-white/72">
                  {ui.productIntro}
                </p>
                <button onClick={() => setStep("profile")} className="k-button mt-10 border-white/70 text-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]">
                  {ui.continue}
                  <ArrowRight className="ml-2" size={18} aria-hidden />
                </button>
              </Panel>
            )}

            {step === "profile" && (
              <Panel title={content.playground.profileTitle} icon={<Ruler size={22} />}>
                <div className="grid border border-white/20 sm:grid-cols-2">
                  {ui.fields.map((field) => (
                    <label key={field} className="border-b border-white/20 p-3 even:sm:border-l sm:[&:nth-last-child(-n+2)]:border-b-0">
                      <span className="k-mono-label mb-3 block text-white/42">{field}</span>
                      <input className="w-full bg-transparent text-xl font-black uppercase text-white outline-none placeholder:text-white/25" placeholder={ui.demoPlaceholder} />
                    </label>
                  ))}
                </div>
                <button onClick={() => setStep("cabin")} className="k-button mt-10 border-white/70 text-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]">
                  {ui.continueToCabin}
                  <ArrowRight className="ml-2" size={18} aria-hidden />
                </button>
              </Panel>
            )}

            {step === "cabin" && (
              <Panel title={content.playground.cabinTitle} icon={<Shirt size={22} />}>
                <div className="h-96 border border-white/20 bg-[#0b0b09]">
                  <CabinCanvas />
                </div>
                <button onClick={() => setStep("result")} className="k-button mt-10 border-white/70 text-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]">
                  {ui.showResult}
                  <ArrowRight className="ml-2" size={18} aria-hidden />
                </button>
              </Panel>
            )}

            {step === "result" && (
              <Panel title={content.playground.resultTitle} icon={<CheckCircle2 size={22} />}>
                <div className="grid border border-white/20 sm:grid-cols-3">
                  <Result label={ui.recommended} value="M" />
                  <Result label={ui.confidence} value={ui.confidenceValue} />
                  <Result label={ui.fit} value={ui.fitValue} />
                </div>
                <p className="mt-8 max-w-xl text-2xl font-black uppercase leading-tight text-[var(--color-signal)]">
                  {ui.fitNote}
                </p>
                <button onClick={saveProgress} className="k-button mt-10 border-white/70 text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:text-[var(--color-paper)]">
                  <Save className="mr-2" size={18} aria-hidden />
                  {isAuthenticated ? content.playground.save : content.playground.loginToSave}
                </button>
                <p className="mt-4 text-sm font-bold uppercase text-white/45">{content.playground.saveHint}</p>
              </Panel>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-8 flex items-center gap-3 text-3xl font-black uppercase leading-none md:text-4xl">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/35 text-[var(--color-signal)] md:h-12 md:w-12">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/20 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="k-mono-label text-white/42">{label}</p>
      <p className="mt-8 text-5xl font-black uppercase leading-none text-[var(--color-paper)]">{value}</p>
    </div>
  );
}

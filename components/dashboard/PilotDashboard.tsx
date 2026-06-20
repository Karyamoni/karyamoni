import Link from "next/link";
import { BarChart3, CheckCircle2, CircleDashed, LogOut, PackageCheck, Store } from "lucide-react";
import type { CurrentUser } from "@/lib/session";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";

type Props = {
  locale: Locale;
  content: SiteContent;
  user: CurrentUser;
};

const products = [
  { name: "Oversized Cotton Shirt", status: "Ready", score: "94%" },
  { name: "Ribbed Texture Blazer", status: "Live", score: "88%" },
  { name: "Straight Fit Denim", status: "Missing data", score: "42%" },
  { name: "Longline Coat", status: "Unsupported", score: "0%" }
];

export function PilotDashboard({ locale, content, user }: Props) {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] pt-16 text-[var(--color-ink)]">
      <section className="border-b k-hairline">
        <div className="k-grid min-h-[380px] content-between py-6 md:py-8">
          <p className="k-label col-span-4 md:col-span-2">{user.provider} session</p>
          <h1 className="k-display col-span-4 md:col-span-6 lg:col-span-7">{content.dashboard.title}</h1>
          <div className="col-span-4 md:col-span-4 lg:col-span-3">
            <p className="k-body text-xl md:text-2xl">{content.dashboard.lead}</p>
            <Link href={`/api/auth/logout?locale=${locale}`} className="k-link mt-8">
              <LogOut className="mr-2" size={16} aria-hidden />
              Sign out
            </Link>
          </div>
        </div>
      </section>

      <section className="k-grid py-4 md:py-6">
        <Panel title={content.dashboard.installStatus} icon={<Store size={21} />} className="col-span-4 md:col-span-4 lg:col-span-3">
          <Status label="IKAS app installed" done />
          <Status label="Permissions approved" done />
          <Status label="Product sync running" done />
          <Status label="Return data connected" />
        </Panel>

        <Panel title={content.dashboard.metrics} icon={<BarChart3 size={21} />} className="col-span-4 md:col-span-4 lg:col-span-5">
          <div className="grid grid-cols-2 border border-[var(--color-ink)]">
            <Metric label="Try-ons" value="1,248" />
            <Metric label="Profile completion" value="71%" />
            <Metric label="Add to cart lift" value="+12%" />
            <Metric label="Return signal" value="-18%" />
          </div>
        </Panel>

        <Panel title={content.dashboard.checklist} icon={<CheckCircle2 size={21} />} className="col-span-4 md:col-span-8 lg:col-span-4">
          {["Install app", "Choose languages", "Activate 2 products", "Review demo analytics"].map((item, index) => (
            <div key={item} className="grid grid-cols-[1fr_auto] border-b border-[var(--color-ink)] py-4 last:border-b-0">
              <p className="text-xl font-black uppercase leading-none">{item}</p>
              <p className="k-label text-[var(--color-ink-soft)]">{index < 3 ? "Done" : "Next"}</p>
            </div>
          ))}
        </Panel>

        <Panel title={content.dashboard.products} icon={<PackageCheck size={21} />} className="col-span-4 md:col-span-8 lg:col-span-8">
          <div className="border border-[var(--color-ink)]">
            {products.map((product) => (
              <div key={product.name} className="grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--color-ink)] p-4 last:border-b-0 md:grid-cols-[1fr_160px_120px]">
                <p className="text-2xl font-black uppercase leading-none">{product.name}</p>
                <p className="k-label text-[var(--color-ink-soft)]">{product.status}</p>
                <p className="text-right text-3xl font-black uppercase leading-none">{product.score}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={content.dashboard.impact} icon={<BarChart3 size={21} />} className="col-span-4 bg-[var(--color-cobalt)] text-[var(--color-paper)] md:col-span-8 lg:col-span-4">
          <Impact label="Size returns baseline" value="23%" />
          <Impact label="Pilot target" value="18%" />
          <Impact label="Confidence" value="Medium" />
        </Panel>
      </section>
    </main>
  );
}

function Panel({ title, icon, children, className = "" }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`border border-current p-4 ${className}`}>
      <h2 className="mb-10 flex items-center gap-3 text-2xl font-black uppercase leading-none">
        <span className="grid h-11 w-11 place-items-center rounded-full border border-current text-[var(--color-signal)]">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Status({ label, done = false }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3 border-b border-current py-4 last:border-b-0">
      {done ? <CheckCircle2 className="text-[var(--color-green)]" size={18} /> : <CircleDashed className="text-[var(--color-signal)]" size={18} />}
      <p className="text-xl font-black uppercase leading-none">{label}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-r border-[var(--color-ink)] p-4 even:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
      <p className="k-label text-[var(--color-ink-soft)]">{label}</p>
      <p className="mt-12 text-5xl font-black uppercase leading-none">{value}</p>
    </div>
  );
}

function Impact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] border-b border-current py-4 last:border-b-0">
      <p className="k-label text-white/55">{label}</p>
      <p className="text-3xl font-black uppercase leading-none">{value}</p>
    </div>
  );
}

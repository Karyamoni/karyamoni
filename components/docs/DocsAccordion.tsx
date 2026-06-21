"use client";

type DocsSection = {
  title: string;
  body: string;
  points: string[];
  steps?: string[];
};

export function DocsAccordion({ sections }: { sections: DocsSection[] }) {
  return (
    <div className="col-span-4 border border-[var(--color-ink)] md:col-span-8 lg:col-span-12">
      {sections.map((section, index) => (
        <details
          key={section.title}
          open={index === 0}
          className="group border-b border-[var(--color-ink)] last:border-b-0"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4 md:p-6 [&::-webkit-details-marker]:hidden">
            <div className="flex items-start gap-4 md:gap-6">
              <span
                className="mt-0.5 shrink-0 font-black text-[var(--color-signal)]"
                style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}
              >
                0{index + 1}
              </span>
              <h2 className="text-2xl font-black uppercase leading-none md:text-4xl">
                {section.title}
              </h2>
            </div>
            <svg
              className="mt-1 shrink-0 transition-transform duration-300 group-open:rotate-180"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>

          <div className="border-t border-[var(--color-ink)] p-4 md:p-6">
            <p className="max-w-3xl text-xl font-black uppercase leading-tight md:text-3xl">
              {section.body}
            </p>

            <div className="mt-6 grid border border-[var(--color-ink)] sm:grid-cols-3">
              {section.points.map((point, i) => (
                <p
                  key={point}
                  className="border-b border-[var(--color-ink)] p-4 text-base font-black uppercase leading-none last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                  style={
                    i === 0
                      ? { color: "var(--color-signal)" }
                      : undefined
                  }
                >
                  {point}
                </p>
              ))}
            </div>

            {section.steps && section.steps.length > 0 && (
              <ol className="mt-6 space-y-0 border border-[var(--color-ink)]">
                {section.steps.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-4 border-b border-[var(--color-ink)] p-4 last:border-b-0"
                  >
                    <span
                      className="shrink-0 font-black tabular-nums text-[var(--color-signal)]"
                      style={{ fontSize: "0.75rem", letterSpacing: "0.08em", marginTop: "2px" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base font-black uppercase leading-none">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

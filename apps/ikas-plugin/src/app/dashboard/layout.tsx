import { IKASIntegrationRail } from "@/components/IKASIntegrationRail";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr",
        minHeight: "100vh",
        background: "var(--paper)",
      }}
    >
      {/* Power line 1: sticky integration rail */}
      <IKASIntegrationRail />

      {/* Main content — starts at power line 2 */}
      <main
        style={{
          padding: "clamp(24px, 4vw, 64px) clamp(24px, 5vw, 80px)",
          maxWidth: "1100px",
        }}
      >
        {/* Dashboard nav — aligns to power lines */}
        <nav
          style={{
            display: "flex",
            gap: "32px",
            marginBottom: "48px",
            borderBottom: "1px solid var(--ink-10)",
            paddingBottom: "16px",
          }}
        >
          {[
            { href: "/dashboard/setup", label: "Setup" },
            { href: "/dashboard/products", label: "Products" },
            { href: "/dashboard/analytics", label: "Analytics" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                textDecoration: "none",
                paddingBottom: "16px",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {children}
      </main>
    </div>
  );
}

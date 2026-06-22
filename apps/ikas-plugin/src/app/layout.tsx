import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karyamoni — IKAS Plugin",
  description: "Virtual try-on management for IKAS merchants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}

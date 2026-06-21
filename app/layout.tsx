import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThreeSilencer } from "@/components/ThreeSilencer";

export const metadata: Metadata = {
  title: "Karyamoni",
  description: "Virtual try-on for IKAS stores."
};

const neueHaas = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    {
      path: "../docs/neue-haas-grotesk-display-pro-cdnfonts/NeueHaasDisplayRoman.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../docs/neue-haas-grotesk-display-pro-cdnfonts/NeueHaasDisplayMediu.ttf",
      weight: "500",
      style: "normal"
    },
    {
      path: "../docs/neue-haas-grotesk-display-pro-cdnfonts/NeueHaasDisplayBold.ttf",
      weight: "700",
      style: "normal"
    },
    {
      path: "../docs/neue-haas-grotesk-display-pro-cdnfonts/NeueHaasDisplayBlack.ttf",
      weight: "900",
      style: "normal"
    }
  ]
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className={neueHaas.variable}>
        <ThreeSilencer />
        {children}
      </body>
    </html>
  );
}

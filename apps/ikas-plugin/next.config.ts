import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["*.myikas.com", "*.trycloudflare.com", "plugin.karyamoni.com", "staging.karyamoni.com"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.myikas.com" }],
  },
  // IKAS embedded app runs inside iframe — disable X-Frame-Options
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

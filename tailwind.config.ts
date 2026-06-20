import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#12130f",
        moss: "#32443a",
        lime: "#c7ff47",
        coral: "#ff6b4a",
        clay: "#c85f38",
        paper: "#f6f1e6",
        mist: "#dfe8e2",
        night: "#17191f"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        editorial: "0 24px 80px rgba(18, 19, 15, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;

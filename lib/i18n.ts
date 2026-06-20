export const locales = ["tr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  return acceptLanguage.toLowerCase().includes("tr") ? "tr" : "en";
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "tr" ? "en" : "tr";
}

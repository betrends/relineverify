// Locale metadata shared by both server (request.ts) and client
// (LanguageSwitcher, the /api/locale route) code — kept free of any
// server-only imports (like next/headers) so client components can import
// it directly without pulling a server module into the browser bundle.
export const locales = ["en", "fr", "es", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "locale";

export const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  fr: { label: "Français", flag: "🇫🇷" },
  es: { label: "Español", flag: "🇪🇸" },
  pt: { label: "Português", flag: "🇵🇹" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./locales";

// Cookie-based locale (not URL-prefixed) — keeps every existing route exactly
// where it is, so this can be adopted incrementally without restructuring
// src/app into a [locale] segment. The switcher just sets a cookie and
// refreshes; the server picks it up here on the next render.
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

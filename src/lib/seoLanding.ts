/**
 * Data helpers for the programmatic SEO landing pages
 * (/services/[slug], /countries/[slug]). Built on top of the existing
 * talktiyu.ts client, which already keeps a 30-minute in-memory cache
 * on the catalog endpoints — good enough for marketing pages that
 * don't need second-by-second price accuracy (the buy flow itself
 * always re-checks live price at order time).
 */
import { AVAILABLE_SERVERS, getCountries, getServices, type TalktiyuCountry, type TalktiyuService } from "./talktiyu";
import { applyMarkup } from "./pricing";
import { slugify } from "./slugify";

export { slugify };

const SERVER = AVAILABLE_SERVERS[0];

// Talktiyu's catalog endpoint is genuinely slow in practice — we measured
// single calls taking anywhere from 5s to 2+ minutes. These pages render
// dynamically per request (see the page files for why), so an unbounded
// wait here would risk hanging — or outright failing — a real visitor's
// or crawler's request. Bounding every call means a slow upstream degrades
// to "page not found" rather than a hung or crashed request; a retry a
// minute later usually succeeds once the in-memory catalog cache is warm.
const CATALOG_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms = CATALOG_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Catalog lookup timed out")), ms)),
  ]);
}

async function sampleCountries(): Promise<TalktiyuCountry[]> {
  return withTimeout(getCountries(SERVER));
}

async function servicesFor(countryId: string): Promise<TalktiyuService[]> {
  return withTimeout(getServices(SERVER, countryId));
}

function preferredPricingCountry(countries: TalktiyuCountry[]): TalktiyuCountry | undefined {
  return countries.find((c) => c.name.toLowerCase() === "nigeria") || countries[0];
}

export type ServiceLanding = {
  service: TalktiyuService;
  priceFrom: number | null;
  countryCount: number;
};

// Checks Nigeria only, single call, no multi-country fallback fan-out — a
// service that only exists outside Nigeria just won't get a dedicated
// landing page, which is an acceptable trade-off given our audience is
// overwhelmingly Nigerian anyway (and keeps this to one bounded call).
export async function getServiceLanding(slug: string): Promise<ServiceLanding | null> {
  const countries = await sampleCountries().catch(() => []);
  const priceCountry = preferredPricingCountry(countries);
  if (!priceCountry) return null;

  let services: TalktiyuService[];
  try {
    services = await servicesFor(priceCountry.id);
  } catch {
    return null;
  }
  const match = services.find((s) => slugify(s.name) === slug);
  if (!match) return null;

  return { service: match, priceFrom: applyMarkup(match.price), countryCount: countries.length };
}

export async function getPopularServiceSlugs(limit = 40): Promise<string[]> {
  const countries = await sampleCountries().catch(() => []);
  const priceCountry = preferredPricingCountry(countries);
  if (!priceCountry) return [];
  const services = await servicesFor(priceCountry.id).catch(() => []);
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const s of services) {
    const slug = slugify(s.name);
    if (seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
    if (slugs.length >= limit) break;
  }
  return slugs;
}

export type CountryLanding = {
  country: TalktiyuCountry;
  popularServices: (TalktiyuService & { priceCharged: number })[];
  totalServices: number;
};

const POPULAR_SERVICE_NAMES = [
  "whatsapp",
  "telegram",
  "google",
  "facebook",
  "instagram",
  "tiktok",
  "discord",
  "twitter",
  "snapchat",
  "signal",
];

export async function getCountryLanding(slug: string): Promise<CountryLanding | null> {
  const countries = await sampleCountries().catch(() => []);
  const country = countries.find((c) => slugify(c.name) === slug);
  if (!country) return null;

  let services: TalktiyuService[];
  try {
    services = await servicesFor(country.id);
  } catch {
    services = [];
  }

  const byPopularity = [...services].sort((a, b) => {
    const ai = POPULAR_SERVICE_NAMES.indexOf(a.name.toLowerCase());
    const bi = POPULAR_SERVICE_NAMES.indexOf(b.name.toLowerCase());
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const popularServices = byPopularity.slice(0, 8).map((s) => ({ ...s, priceCharged: applyMarkup(s.price) }));

  return { country, popularServices, totalServices: services.length };
}

export async function getPopularCountrySlugs(limit = 60): Promise<string[]> {
  const countries = await sampleCountries().catch(() => []);
  return countries.slice(0, limit).map((c) => slugify(c.name));
}

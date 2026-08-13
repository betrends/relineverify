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

// A handful of countries to sample when we need "what services exist at
// all" without fetching every country's full catalog (some have hundreds
// of countries, and each services call is its own slow upstream request).
async function sampleCountries(): Promise<TalktiyuCountry[]> {
  const countries = await getCountries(SERVER);
  return countries;
}

function preferredPricingCountry(countries: TalktiyuCountry[]): TalktiyuCountry | undefined {
  return countries.find((c) => c.name.toLowerCase() === "nigeria") || countries[0];
}

export type ServiceLanding = {
  service: TalktiyuService;
  priceFrom: number | null;
  countryCount: number;
};

// Talktiyu's catalog endpoint is genuinely slow in practice — we measured
// single calls taking anywhere from 5s to 2+ minutes. That's tolerable for
// a one-time build/ISR-regeneration cost (see `revalidate` below, and note
// that generateStaticParams covers the popular slugs at build time so real
// visitors almost never hit a live call at all) but NOT something a page
// can afford to do more than once. So: check Nigeria only, single call, no
// multi-country fallback fan-out — a service that only exists outside
// Nigeria just won't get a dedicated landing page, which is an acceptable
// trade-off given our audience is overwhelmingly Nigerian anyway.
export async function getServiceLanding(slug: string): Promise<ServiceLanding | null> {
  const countries = await sampleCountries();
  const priceCountry = preferredPricingCountry(countries);
  if (!priceCountry) return null;

  let services: TalktiyuService[];
  try {
    services = await getServices(SERVER, priceCountry.id);
  } catch {
    return null;
  }
  const match = services.find((s) => slugify(s.name) === slug);
  if (!match) return null;

  return { service: match, priceFrom: applyMarkup(match.price), countryCount: countries.length };
}

export async function getPopularServiceSlugs(limit = 40): Promise<string[]> {
  const countries = await sampleCountries();
  const priceCountry = preferredPricingCountry(countries);
  if (!priceCountry) return [];
  const services = await getServices(SERVER, priceCountry.id);
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
  const countries = await sampleCountries();
  const country = countries.find((c) => slugify(c.name) === slug);
  if (!country) return null;

  let services: TalktiyuService[];
  try {
    services = await getServices(SERVER, country.id);
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
  const countries = await sampleCountries();
  return countries.slice(0, limit).map((c) => slugify(c.name));
}

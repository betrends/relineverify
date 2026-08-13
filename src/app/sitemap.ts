import type { MetadataRoute } from "next";
import { getPopularServiceSlugs, getPopularCountrySlugs } from "@/lib/seoLanding";

// The upstream catalog API this depends on is slow (see seoLanding.ts) —
// without this, sitemap.xml would re-run those calls on every single
// request instead of serving a cached copy, and Search Console expects a
// sitemap to respond quickly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const routes = ["", "/countries", "/services", "/faq", "/contact", "/login", "/signup"];

  const staticEntries = routes.map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  // Best-effort — the upstream catalog API can be flaky, and a broken
  // sitemap build is worse than a sitemap missing its long-tail pages.
  const [serviceSlugs, countrySlugs] = await Promise.all([
    getPopularServiceSlugs(40).catch(() => []),
    getPopularCountrySlugs(60).catch(() => []),
  ]);

  const serviceEntries = serviceSlugs.map((slug) => ({
    url: `${appUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  const countryEntries = countrySlugs.map((slug) => ({
    url: `${appUrl}/countries/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...countryEntries];
}

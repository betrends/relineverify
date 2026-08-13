// Standalone, dependency-free — safe to import from client components
// (e.g. PlatformsGrid, CountriesPage) to link into /services/[slug] and
// /countries/[slug] without pulling talktiyu.ts (server-only, holds the
// API key) into the client bundle.
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

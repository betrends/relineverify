import { getCountries, getServices, AVAILABLE_SERVERS } from "@/lib/talktiyu";
import { rateLimitOrNull } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";

// Public, unauthenticated list of supported platforms for the marketing
// site. Deliberately name-only — no price or stock numbers are exposed
// here, since those are only meaningful once signed in.
export async function GET(req: NextRequest) {
  const limited = await rateLimitOrNull(req, "public-platforms", 60, 60 * 1000);
  if (limited) return limited;

  try {
    const server = AVAILABLE_SERVERS[0];
    const countries = await getCountries(server);
    if (countries.length === 0) return NextResponse.json({ platforms: [] });

    // Any single country's catalog is a partial subset — sample a handful
    // and union them so the marketing page shows the fullest picture of
    // what we support, not just whatever one country happens to offer.
    const sample = countries.slice(0, 6);
    const results = await Promise.allSettled(sample.map((c) => getServices(server, c.id)));

    const seen = new Set<string>();
    const platforms: { id: string; name: string }[] = [];
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const s of result.value) {
        const key = s.name.trim().toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        platforms.push({ id: s.id, name: s.name.trim() });
      }
    }
    platforms.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ platforms });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Could not load platforms" }, { status: 502 });
  }
}

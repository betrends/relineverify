import { NextRequest, NextResponse } from "next/server";
import { getCountries, AVAILABLE_SERVERS } from "@/lib/talktiyu";
import { rateLimitOrNull } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const limited = await rateLimitOrNull(req, "public-countries", 60, 60 * 1000);
  if (limited) return limited;

  try {
    const countries = await getCountries(AVAILABLE_SERVERS[0]);
    const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ countries: sorted });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Could not load countries" }, { status: 502 });
  }
}

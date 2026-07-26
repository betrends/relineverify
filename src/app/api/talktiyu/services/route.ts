import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getServices } from "@/lib/talktiyu";
import { applyMarkup } from "@/lib/pricing";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const server = req.nextUrl.searchParams.get("server");
  const country = req.nextUrl.searchParams.get("country");
  if (!server || !country) {
    return NextResponse.json({ error: "Missing server or country" }, { status: 400 });
  }

  try {
    const services = await getServices(server, country);
    // Never leak Talktiyu's raw base price to the client — only the
    // marked-up price we actually charge.
    const priced = services.map((s) => ({
      id: s.id,
      name: s.name,
      available: s.available,
      price: applyMarkup(s.price),
    }));
    return NextResponse.json({ services: priced });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Could not load services" },
      { status: 502 }
    );
  }
}

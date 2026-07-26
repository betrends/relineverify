import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getCountries } from "@/lib/talktiyu";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const server = req.nextUrl.searchParams.get("server");
  if (!server) return NextResponse.json({ error: "Missing server" }, { status: 400 });

  try {
    const countries = await getCountries(server);
    return NextResponse.json({ countries });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Could not load countries" },
      { status: 502 }
    );
  }
}

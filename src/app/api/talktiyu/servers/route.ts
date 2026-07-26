import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { AVAILABLE_SERVERS } from "@/lib/talktiyu";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json({ servers: AVAILABLE_SERVERS });
}

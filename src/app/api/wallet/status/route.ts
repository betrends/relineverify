import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) return NextResponse.json({ error: "Missing ref" }, { status: 400 });

  const transaction = await prisma.transaction.findFirst({
    where: { reference: ref, userId: session.userId },
  });
  if (!transaction) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ status: transaction.status, amount: transaction.amount });
}

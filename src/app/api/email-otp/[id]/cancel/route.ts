import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const SELECT = {
  id: true,
  address: true,
  costCharged: true,
  emailText: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Lets a user give up on a still-waiting inbox without waiting out the
// full wait window. Deliberately no refund — cancelling early is a choice,
// not a provider failure, so it's not treated the same as a code that never
// arrived.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const record = await prisma.generatedEmail.findUnique({ where: { id: params.id } });
  if (!record || record.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const claimed = await prisma.generatedEmail.updateMany({
    where: { id: record.id, status: "pending" },
    data: { status: "cancelled" },
  });
  if (claimed.count === 0) {
    return NextResponse.json({ error: "This email can no longer be cancelled" }, { status: 400 });
  }

  const updated = await prisma.generatedEmail.findUniqueOrThrow({ where: { id: record.id }, select: SELECT });
  return NextResponse.json({ email: updated });
}

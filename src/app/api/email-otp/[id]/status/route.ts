import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { checkInbox, TempMailAuthError } from "@/lib/tempMail";
import { EMAIL_WAIT_EXPIRY_MS } from "@/lib/codeExpiry";

const SELECT = {
  id: true,
  address: true,
  costCharged: true,
  emailText: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const record = await prisma.generatedEmail.findUnique({ where: { id: params.id } });
  if (!record || record.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (record.status !== "pending") {
    const { providerInboxId, ...safe } = record;
    return NextResponse.json({ email: safe });
  }

  const ageMs = Date.now() - record.createdAt.getTime();
  if (ageMs > EMAIL_WAIT_EXPIRY_MS) {
    const expired = await closeExpired(record.id);
    return NextResponse.json({ email: expired });
  }

  try {
    const result = await checkInbox(record.address, record.providerInboxId);
    if (result.received) {
      const updated = await prisma.generatedEmail.update({
        where: { id: record.id },
        data: { status: "received", emailText: result.text || result.subject },
        select: SELECT,
      });
      return NextResponse.json({ email: updated });
    }
  } catch (err) {
    if (err instanceof TempMailAuthError) {
      // Provider killed this inbox — waiting out the full timer won't help,
      // so close it out now instead of leaving the user stuck on "Waiting".
      const closed = await closeExpired(record.id);
      return NextResponse.json({ email: closed });
    }
    // Transient upstream error — report current known state, client will retry.
  }

  const { providerInboxId, ...safe } = record;
  return NextResponse.json({ email: safe });
}

// No refund on expiry — same policy as a user-initiated cancel: once the
// window's closed (or the provider's dead), the charge is kept.
async function closeExpired(id: string) {
  // Guard against concurrent polls both racing this transition — harmless
  // now that there's no refund at stake, but keeps behavior deterministic.
  await prisma.generatedEmail.updateMany({
    where: { id, status: "pending" },
    data: { status: "expired" },
  });
  return prisma.generatedEmail.findUniqueOrThrow({ where: { id }, select: SELECT });
}

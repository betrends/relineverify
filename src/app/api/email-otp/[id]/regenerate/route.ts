import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { rateLimitOrNull } from "@/lib/rateLimit";
import { EMAIL_CODE_EXPIRY_MS } from "@/lib/codeExpiry";

const REGENERATE_COST = 1000;

const SELECT = {
  id: true,
  address: true,
  costCharged: true,
  emailText: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Requests a fresh code on the SAME inbox (no new provider inbox) — only
// once the previous code has actually gone stale, and only on an inbox
// we've proven works (a code has landed there before).
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const limited = await rateLimitOrNull(req, "email-otp-regenerate", 10, 60 * 60 * 1000);
  if (limited) return limited;

  const record = await prisma.generatedEmail.findUnique({ where: { id: params.id } });
  if (!record || record.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (record.status !== "received") {
    return NextResponse.json({ error: "This email isn't ready for a new code yet" }, { status: 400 });
  }
  if (Date.now() - record.updatedAt.getTime() < EMAIL_CODE_EXPIRY_MS) {
    return NextResponse.json({ error: "The current code hasn't expired yet" }, { status: 400 });
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } });
  if (user.walletBalance < REGENERATE_COST) {
    const needed = Math.max(REGENERATE_COST - user.walletBalance, 100);
    return NextResponse.json({ error: "Insufficient wallet balance", needed }, { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    // Guard against a double-click or two tabs both passing the "received"
    // check above before either commits — only the request that actually
    // flips the record away from "received" gets to charge the wallet.
    const claimed = await tx.generatedEmail.updateMany({
      where: { id: record.id, status: "received" },
      data: {
        status: "pending",
        emailText: null,
        costCharged: REGENERATE_COST,
        // Restarts the wait-for-code window for this attempt —
        // the original address/providerInboxId are untouched.
        createdAt: new Date(),
      },
    });
    if (claimed.count === 0) {
      return tx.generatedEmail.findUniqueOrThrow({ where: { id: record.id }, select: SELECT });
    }
    await tx.user.update({
      where: { id: session.userId },
      data: { walletBalance: { decrement: REGENERATE_COST } },
    });
    await tx.transaction.create({
      data: {
        userId: session.userId,
        type: "email",
        amount: REGENERATE_COST,
        reference: `email_regen_${randomUUID()}`,
        status: "successful",
      },
    });
    return tx.generatedEmail.findUniqueOrThrow({ where: { id: record.id }, select: SELECT });
  });

  if (updated.status !== "pending") {
    return NextResponse.json({ error: "This email isn't ready for a new code yet" }, { status: 400 });
  }

  return NextResponse.json({ email: updated });
}

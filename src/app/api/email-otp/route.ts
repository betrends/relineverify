import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createInbox, TempMailError } from "@/lib/tempMail";
import { rateLimitOrNull } from "@/lib/rateLimit";

const EMAIL_COST = 1000;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const emails = await prisma.generatedEmail.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      address: true,
      costCharged: true,
      emailText: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ emails });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const limited = await rateLimitOrNull(req, "email-otp-generate", 10, 60 * 60 * 1000);
  if (limited) return limited;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } });
  if (user.walletBalance < EMAIL_COST) {
    const needed = Math.max(EMAIL_COST - user.walletBalance, 100);
    return NextResponse.json(
      { error: "Insufficient wallet balance", needed },
      { status: 400 }
    );
  }

  let inbox;
  try {
    inbox = await createInbox();
  } catch (err) {
    const message = err instanceof TempMailError ? err.message : "Could not generate an email address";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const generated = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.userId },
      data: { walletBalance: { decrement: EMAIL_COST } },
    });
    await tx.transaction.create({
      data: {
        userId: session.userId,
        type: "email",
        amount: EMAIL_COST,
        reference: `email_${randomUUID()}`,
        status: "successful",
      },
    });
    return tx.generatedEmail.create({
      data: {
        userId: session.userId,
        address: inbox.address,
        mailPassword: inbox.password,
        costCharged: EMAIL_COST,
        status: "pending",
      },
      select: {
        id: true,
        address: true,
        costCharged: true,
        emailText: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  return NextResponse.json({ email: generated });
}

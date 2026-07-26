import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { initializePayment } from "@/lib/korapay";

const schema = z.object({
  amount: z.number().int().min(100, "Minimum top-up is ₦100"),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid amount" },
      { status: 400 }
    );
  }

  const reference = `topup_${randomUUID()}`;
  await prisma.transaction.create({
    data: {
      userId: session.userId,
      type: "topup",
      amount: parsed.data.amount,
      reference,
      status: "pending",
    },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  try {
    const link = await initializePayment({
      reference,
      amountNgn: parsed.data.amount,
      email: session.email,
      redirectUrl: `${appUrl}/dashboard?topup_ref=${reference}`,
    });
    return NextResponse.json({ link });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Could not start payment" },
      { status: 502 }
    );
  }
}

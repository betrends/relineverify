import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const schema = z.object({
  // Negative amounts are allowed too — lets an admin correct a mistaken
  // credit without reaching into the database directly.
  amount: z.number().int().refine((n) => n !== 0, "Amount can't be zero"),
  note: z.string().trim().max(200).optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { user: admin, response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid amount" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (parsed.data.amount < 0 && target.walletBalance + parsed.data.amount < 0) {
    return NextResponse.json({ error: "That would take the wallet below ₦0" }, { status: 400 });
  }

  // Reuses the "topup"/"purchase" transaction types the customer-facing
  // history already knows how to render (a strict type→label map there
  // would break on an unrecognized type) — the "admin_" reference prefix
  // is what marks this as a manual adjustment in the database/admin view.
  const [updated] = await prisma.$transaction([
    prisma.user.update({
      where: { id: params.id },
      data: { walletBalance: { increment: parsed.data.amount } },
      select: { id: true, walletBalance: true },
    }),
    prisma.transaction.create({
      data: {
        userId: params.id,
        type: parsed.data.amount > 0 ? "topup" : "purchase",
        amount: Math.abs(parsed.data.amount),
        reference: `admin_${admin!.id}_${randomUUID()}`,
        status: "successful",
      },
    }),
  ]);

  return NextResponse.json({ walletBalance: updated.walletBalance });
}

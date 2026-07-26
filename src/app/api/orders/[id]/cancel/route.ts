import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { cancelOrder, TalktiyuError } from "@/lib/talktiyu";

const MIN_WAIT_MS = 2 * 60 * 1000;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order || order.userId !== session.userId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "pending") {
    return NextResponse.json({ error: "Order can no longer be cancelled" }, { status: 400 });
  }

  const ageMs = Date.now() - order.createdAt.getTime();
  if (ageMs < MIN_WAIT_MS) {
    const waitSec = Math.ceil((MIN_WAIT_MS - ageMs) / 1000);
    return NextResponse.json(
      { error: `Please wait ${waitSec}s before cancelling` },
      { status: 400 }
    );
  }

  try {
    await cancelOrder(order.externalOrderId);
  } catch (err: any) {
    const message =
      err instanceof TalktiyuError ? err.message : "Could not cancel order";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: order.userId },
      data: { walletBalance: { increment: order.costCharged } },
    });
    await tx.transaction.create({
      data: {
        userId: order.userId,
        type: "refund",
        amount: order.costCharged,
        reference: `refund_${order.externalOrderId}_${Date.now()}`,
        status: "successful",
      },
    });
    return tx.order.update({ where: { id: order.id }, data: { status: "cancelled" } });
  });

  return NextResponse.json({ order: updated });
}

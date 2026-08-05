import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getOrderStatus } from "@/lib/talktiyu";

const EXPIRY_MS = 20 * 60 * 1000;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order || order.userId !== session.userId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Already settled — no need to hit Talktiyu again.
  if (order.status !== "pending") {
    return NextResponse.json({ order });
  }

  const ageMs = Date.now() - order.createdAt.getTime();
  if (ageMs > EXPIRY_MS) {
    const expired = await refundAndClose(order, "expired");
    return NextResponse.json({ order: expired });
  }

  try {
    const remote = await getOrderStatus(order.externalOrderId);

    if (remote.order_status === "received" && remote.sms) {
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: "received", smsText: remote.sms },
      });
      return NextResponse.json({ order: updated });
    }

    if (remote.order_status === "expired" || remote.order_status === "cancelled") {
      const closed = await refundAndClose(
        order,
        remote.order_status === "expired" ? "expired" : "cancelled"
      );
      return NextResponse.json({ order: closed });
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    // Transient upstream error — report current known state, client will retry.
    return NextResponse.json({ order });
  }
}

async function refundAndClose(
  order: { id: string; userId: string; costCharged: number; externalOrderId: string },
  status: "expired" | "cancelled"
) {
  return prisma.$transaction(async (tx) => {
    // Concurrent polls can both read this order as "pending" before either
    // commits — guard the transition so only the request that actually
    // flips it away from "pending" gets to issue the refund, otherwise two
    // overlapping checks could both refund the same charge.
    const claimed = await tx.order.updateMany({
      where: { id: order.id, status: "pending" },
      data: { status },
    });
    if (claimed.count === 0) {
      return tx.order.findUniqueOrThrow({ where: { id: order.id } });
    }
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
    return tx.order.findUniqueOrThrow({ where: { id: order.id } });
  });
}

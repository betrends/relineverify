import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createOrder, getServices, TalktiyuError } from "@/lib/talktiyu";
import { applyMarkup } from "@/lib/pricing";

const schema = z.object({
  server: z.string().min(1),
  country: z.string().min(1),
  countryName: z.string().min(1),
  service: z.string().min(1),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { server, country, countryName, service } = parsed.data;

  try {
    // Re-derive the authoritative base price server-side — never trust a
    // price the client might have sent.
    const services = await getServices(server, country);
    const match = services.find((s) => s.id === service);
    if (!match) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 404 });
    }
    const charged = await applyMarkup(match.price);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.userId },
    });
    if (user.walletBalance < charged) {
      const needed = Math.max(charged - user.walletBalance, 100);
      return NextResponse.json(
        { error: "Insufficient wallet balance", needed },
        { status: 400 }
      );
    }

    const talktiyuOrder = await createOrder({
      server,
      service,
      country,
      service_name: match.name,
      country_name: countryName,
    });

    const order = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.userId },
        data: { walletBalance: { decrement: charged } },
      });
      await tx.transaction.create({
        data: {
          userId: session.userId,
          type: "purchase",
          amount: charged,
          reference: `order_${talktiyuOrder.order_id}`,
          status: "successful",
        },
      });
      return tx.order.create({
        data: {
          userId: session.userId,
          externalOrderId: talktiyuOrder.order_id,
          server,
          country,
          countryName,
          service,
          serviceName: match.name,
          number: talktiyuOrder.number,
          costBase: talktiyuOrder.cost,
          costCharged: charged,
          status: "pending",
        },
      });
    });

    return NextResponse.json({ order });
  } catch (err: any) {
    const message =
      err instanceof TalktiyuError ? err.message : err?.message || "Could not buy number";
    const status = err instanceof TalktiyuError ? 502 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

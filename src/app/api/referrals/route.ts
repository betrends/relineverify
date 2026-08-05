import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getOrCreateReferralCode, REFERRAL_PERCENT } from "@/lib/referral";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const [code, totalReferred, earnings] = await Promise.all([
    getOrCreateReferralCode(session.userId),
    prisma.user.count({ where: { referredById: session.userId } }),
    prisma.referralEarning.findMany({
      where: { referrerId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const referredUserIds = [...new Set(earnings.map((e) => e.referredUserId))];
  const referredUsers = referredUserIds.length
    ? await prisma.user.findMany({
        where: { id: { in: referredUserIds } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const referredById = new Map(referredUsers.map((u) => [u.id, u]));

  const totalEarned = earnings.reduce((sum, e) => sum + e.rewardAmount, 0);

  return NextResponse.json({
    code,
    percent: REFERRAL_PERCENT,
    totalReferred,
    totalEarned,
    earnings: earnings.map((e) => {
      const referred = referredById.get(e.referredUserId);
      return {
        id: e.id,
        referredName: referred?.name || referred?.email.split("@")[0] || "A friend",
        topupAmount: e.topupAmount,
        rewardAmount: e.rewardAmount,
        createdAt: e.createdAt,
      };
    }),
  });
}

import crypto from "crypto";
import { prisma } from "./prisma";
import { getSetting } from "./siteSettings";

/** Admin-editable via /admin/settings (defaults to 5%). */
export async function getReferralPercent(): Promise<number> {
  const raw = Number(await getSetting("referralPercent"));
  return Number.isFinite(raw) && raw >= 0 ? raw : 5;
}

// Rounds down so we never credit a fraction of a Naira.
export function calculateReward(topupAmount: number, percent: number): number {
  return Math.floor((topupAmount * percent) / 100);
}

/** Async, DB-backed convenience wrapper around calculateReward + getReferralPercent. */
export async function calculateReferralReward(topupAmount: number): Promise<number> {
  return calculateReward(topupAmount, await getReferralPercent());
}

// No 0/O/1/I/L — avoids codes that are ambiguous when read aloud or typed.
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomCode(length = 7) {
  return Array.from(crypto.randomBytes(length))
    .map((b) => CODE_CHARS[b % CODE_CHARS.length])
    .join("");
}

export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (user.referralCode) return user.referralCode;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
        select: { referralCode: true },
      });
      return updated.referralCode!;
    } catch (err: any) {
      if (err.code === "P2002") continue; // code collision — retry
      throw err;
    }
  }
  throw new Error("Could not generate a unique referral code");
}

export async function findReferrerByCode(rawCode: string) {
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;
  return prisma.user.findUnique({ where: { referralCode: code }, select: { id: true } });
}

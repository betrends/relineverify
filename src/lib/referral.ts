import crypto from "crypto";
import { prisma } from "./prisma";

export const REFERRAL_PERCENT = 5;

// Rounds down so we never credit a fraction of a Naira.
export function calculateReferralReward(topupAmount: number): number {
  return Math.floor((topupAmount * REFERRAL_PERCENT) / 100);
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

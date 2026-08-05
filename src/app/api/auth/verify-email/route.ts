import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { rateLimitOrNull } from "@/lib/rateLimit";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const appUrl = process.env.APP_URL || req.nextUrl.origin;
  const limited = await rateLimitOrNull(req, "verify-email", 20, 60 * 60 * 1000);
  if (limited) return limited;

  const token = req.nextUrl.searchParams.get("token");
  const fail = (message: string) =>
    NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, appUrl));

  if (!token) return fail("This verification link is invalid.");

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const verificationToken = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });

  if (!verificationToken || verificationToken.usedAt || verificationToken.expiresAt < new Date()) {
    return fail("This verification link is invalid or has expired. Request a new one from Settings.");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  const session = await getSession();
  const destination = session ? "/dashboard/settings?verified=1" : "/login?verified=1";
  return NextResponse.redirect(new URL(destination, appUrl));
}

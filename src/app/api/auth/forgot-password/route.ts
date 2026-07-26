import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimitOrNull } from "@/lib/rateLimit";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const limited = rateLimitOrNull(req, "forgot-password", 5, 60 * 60 * 1000);
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond the same way whether or not the account exists, so we don't
  // leak which emails are registered.
  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    const appUrl = process.env.APP_URL || req.nextUrl.origin;
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (err) {
      console.error("[forgot-password] failed to send reset email:", err);
    }
  }

  return NextResponse.json({ ok: true });
}

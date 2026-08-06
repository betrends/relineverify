import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { rateLimitOrNull } from "@/lib/rateLimit";
import { issueVerificationEmail } from "@/lib/emailVerification";
import { findReferrerByCode } from "@/lib/referral";
import { isDeliverableEmailDomain } from "@/lib/validateEmailDomain";
import { sendWelcomeEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  referralCode: z.string().trim().max(20).optional(),
});

export async function POST(req: NextRequest) {
  const limited = await rateLimitOrNull(req, "signup", 5, 60 * 60 * 1000);
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 }
    );
  }

  // Reject domains that can't actually receive mail (typos, made-up
  // domains, known disposable-email providers) before creating the
  // account — catches most junk signups without needing a paid
  // mailbox-verification API.
  const deliverable = await isDeliverableEmailDomain(email);
  if (!deliverable) {
    return NextResponse.json(
      { error: "That email address doesn't look like it can receive mail — please use a real, active email" },
      { status: 400 }
    );
  }

  const referrer = parsed.data.referralCode ? await findReferrerByCode(parsed.data.referralCode) : null;

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      walletBalance: 0,
      name: parsed.data.name || null,
      phone: parsed.data.phone || null,
      referredById: referrer?.id,
    },
  });

  const token = await createSessionToken({ userId: user.id, email: user.email });
  await setSessionCookie(token);

  const appUrl = process.env.APP_URL || req.nextUrl.origin;
  await issueVerificationEmail(user.id, user.email, appUrl);
  try {
    await sendWelcomeEmail(user.email, { name: user.name, dashboardUrl: `${appUrl}/dashboard` });
  } catch (err) {
    console.error("[signup] failed to send welcome email:", err);
  }

  return NextResponse.json({ email: user.email });
}

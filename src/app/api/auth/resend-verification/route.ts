import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { rateLimitOrNull } from "@/lib/rateLimit";
import { issueVerificationEmail } from "@/lib/emailVerification";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const limited = rateLimitOrNull(req, "resend-verification", 3, 15 * 60 * 1000);
  if (limited) return limited;

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const appUrl = process.env.APP_URL || req.nextUrl.origin;
  await issueVerificationEmail(user.id, user.email, appUrl);

  return NextResponse.json({ ok: true });
}

import crypto from "crypto";
import { prisma } from "./prisma";
import { sendVerificationEmail } from "./email";

export async function issueVerificationEmail(userId: string, email: string, appUrl: string) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${rawToken}`;
  try {
    await sendVerificationEmail(email, verifyUrl);
  } catch (err) {
    console.error("[email-verification] failed to send verification email:", err);
  }
}

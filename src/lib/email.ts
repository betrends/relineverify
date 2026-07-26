import { Resend } from "resend";

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = getClient();
  const from = process.env.EMAIL_FROM || "Reline <onboarding@resend.dev>";

  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set. Reset link for ${to}: ${resetUrl}`);
    return { devMode: true as const };
  }

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Reset your Reline password",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Reset your password</h2>
        <p style="color: #475569; line-height: 1.6;">
          We received a request to reset the password for your Reline account. Click the button
          below to choose a new one. This link expires in 30 minutes.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #7c5cfc; color: white; text-decoration: none; border-radius: 10px; font-weight: 600;">
          Reset password
        </a>
        <p style="color: #94a3b8; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
  return { devMode: false as const };
}

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  const resend = getClient();
  const from = process.env.EMAIL_FROM || "Reline <onboarding@resend.dev>";

  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set. Verification link for ${to}: ${verifyUrl}`);
    return { devMode: true as const };
  }

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Verify your Reline email",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Verify your email</h2>
        <p style="color: #475569; line-height: 1.6;">
          Welcome to Reline! Confirm this is your email address to finish setting up your account.
          This link expires in 24 hours.
        </p>
        <a href="${verifyUrl}"
           style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #7c5cfc; color: white; text-decoration: none; border-radius: 10px; font-weight: 600;">
          Verify email
        </a>
        <p style="color: #94a3b8; font-size: 13px;">
          If you didn't create a Reline account, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
  return { devMode: false as const };
}

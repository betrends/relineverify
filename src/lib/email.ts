import { Resend } from "resend";
import { SUPPORT_EMAIL } from "@/lib/contact";

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

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessage(params: { name: string; email: string; message: string }) {
  const resend = getClient();
  const from = process.env.EMAIL_FROM || "Reline <onboarding@resend.dev>";

  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set. Contact message from ${params.email}: ${params.message}`);
    return { devMode: true as const };
  }

  const name = escapeHtml(params.name);
  const email = escapeHtml(params.email);
  const message = escapeHtml(params.message);

  const { error } = await resend.emails.send({
    from,
    to: SUPPORT_EMAIL,
    replyTo: params.email,
    subject: `Reline contact form: ${params.name}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0f172a;">New contact message</h2>
        <p style="color: #475569;"><strong>${name}</strong> (${email})</p>
        <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
  return { devMode: false as const };
}

export async function sendWelcomeEmail(to: string, params: { name: string | null; dashboardUrl: string }) {
  const resend = getClient();
  const from = process.env.EMAIL_FROM || "Reline <onboarding@resend.dev>";
  const greeting = params.name ? `Hi ${escapeHtml(params.name)},` : "Hi there,";

  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set. Welcome email skipped for ${to}.`);
    return { devMode: true as const };
  }

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Welcome to Reline — here's how to get started",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Welcome to Reline 👋</h2>
        <p style="color: #475569; line-height: 1.6;">${greeting}</p>
        <p style="color: #475569; line-height: 1.6;">
          Your account is ready. Reline gives you instant virtual phone numbers and temporary email
          addresses for receiving SMS and email verification codes — no SIM card required. Here's how
          to get going:
        </p>
        <ol style="color: #475569; line-height: 1.9; padding-left: 20px;">
          <li><strong>Top up your wallet</strong> — fund it in Naira from your dashboard.</li>
          <li><strong>Buy a number or generate an email</strong> — pick a service (WhatsApp, Telegram, Google, and more) and country.</li>
          <li><strong>Receive your code</strong> — it lands in your dashboard in seconds, with a sound alert so you never miss it.</li>
        </ol>
        <a href="${params.dashboardUrl}"
           style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #7c5cfc; color: white; text-decoration: none; border-radius: 10px; font-weight: 600;">
          Go to my dashboard
        </a>
        <p style="color: #94a3b8; font-size: 13px;">
          Questions? Just reply to this email — we're happy to help.
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

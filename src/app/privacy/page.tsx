import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { SUPPORT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy Policy — Reline",
  description: "How Reline collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="29 July 2026">
      <LegalSection heading="1. What this covers">
        <p>
          This Privacy Policy explains what information Reline collects when you use our virtual number and email
          verification service, how we use it, and the choices you have.
        </p>
      </LegalSection>

      <LegalSection heading="2. Information we collect">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-slate-700 dark:text-slate-300">Account information:</strong> name, email address,
            phone number, and a hashed password (or your Google account identifier if you sign in with Google).
          </li>
          <li>
            <strong className="text-slate-700 dark:text-slate-300">Transaction records:</strong> wallet top-ups,
            purchases, and refunds, including amounts and timestamps. We never see or store your card or bank
            details — those are handled directly by our payment processor, Korapay.
          </li>
          <li>
            <strong className="text-slate-700 dark:text-slate-300">Usage data:</strong> the numbers and email
            addresses you generate, the services you verify with, and basic technical data like IP address and
            browser type, used for security and abuse prevention.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. How we use your information">
        <ul className="list-disc space-y-1 pl-5">
          <li>To provide and maintain the service, including delivering verification codes to your dashboard</li>
          <li>To process payments and maintain your wallet balance</li>
          <li>To send account-related email, such as email verification, password resets, and order updates</li>
          <li>To detect and prevent fraud, abuse, and violations of our Terms</li>
          <li>To respond to support requests you send us</li>
        </ul>
        <p>We don't sell your personal information.</p>
      </LegalSection>

      <LegalSection heading="4. Who we share it with">
        <p>We share the minimum information necessary with the third parties that make Reline work:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-slate-700 dark:text-slate-300">Korapay</strong> — to process wallet top-ups
          </li>
          <li>
            <strong className="text-slate-700 dark:text-slate-300">Our number and email suppliers</strong> — to
            provision the virtual numbers and inboxes you request
          </li>
          <li>
            <strong className="text-slate-700 dark:text-slate-300">Resend</strong> — to deliver transactional email
            (verification, password reset)
          </li>
          <li>
            <strong className="text-slate-700 dark:text-slate-300">Google</strong> — only if you choose to sign in
            with Google
          </li>
        </ul>
        <p>
          We may also disclose information if required by law, or to protect the rights, safety, or property of
          Reline or our users.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data retention">
        <p>
          We keep your account and transaction data for as long as your account is active, and for a reasonable
          period afterward to meet legal, accounting, and fraud-prevention obligations. You can request deletion of
          your account at any time — see below.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your rights">
        <p>
          You can access, correct, or request deletion of your personal information from your account settings, or
          by contacting us directly. If you're in a jurisdiction with data protection laws (including Nigeria's Data
          Protection Act), you may have additional rights over your data, which we'll honor on request.
        </p>
      </LegalSection>

      <LegalSection heading="7. Cookies">
        <p>
          We use a single session cookie to keep you signed in. We don't use third-party advertising or tracking
          cookies.
        </p>
      </LegalSection>

      <LegalSection heading="8. Security">
        <p>
          Passwords are stored hashed, never in plain text. We use industry-standard measures to protect your data,
          but no online service can guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="9. Children's privacy">
        <p>Reline isn't intended for anyone under 18, and we don't knowingly collect data from children.</p>
      </LegalSection>

      <LegalSection heading="10. Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will be reflected by updating the date at
          the top of this page.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact">
        <p>
          Questions about this policy or your data? Reach us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-violet-600 hover:underline dark:text-violet-300">
            {SUPPORT_EMAIL}
          </a>{" "}
          or via our{" "}
          <Link href="/contact" className="font-medium text-violet-600 hover:underline dark:text-violet-300">
            Contact page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

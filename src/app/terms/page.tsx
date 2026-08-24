import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { getSupportEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Terms of Service — Reline",
  description: "The terms that govern your use of Reline's virtual number and email verification service.",
};

export default async function TermsPage() {
  const SUPPORT_EMAIL = await getSupportEmail();
  return (
    <LegalLayout title="Terms of Service" updated="29 July 2026">
      <LegalSection heading="1. About these terms">
        <p>
          These Terms of Service ("Terms") govern your access to and use of Reline, a virtual phone number and
          disposable email service for receiving one-time verification codes. By creating an account or using
          Reline, you agree to these Terms. If you don't agree, please don't use the service.
        </p>
      </LegalSection>

      <LegalSection heading="2. Who can use Reline">
        <p>
          You must be at least 18 years old and able to form a binding contract to use Reline. You're responsible
          for keeping your account credentials secure and for all activity that happens under your account.
        </p>
      </LegalSection>

      <LegalSection heading="3. What Reline provides">
        <p>
          Reline lets you rent a virtual phone number or generate a temporary email address to receive a one-time
          verification code from a third-party service. Numbers and email addresses are provided through third-party
          suppliers we don't control, so delivery speed and availability can vary and aren't guaranteed.
        </p>
      </LegalSection>

      <LegalSection heading="4. Wallet, payments, and refunds">
        <p>
          You fund your Reline wallet in Naira through our payment partner, Korapay. Wallet funds are used to pay for
          numbers and email addresses at the price shown at the time of purchase.
        </p>
        <p>
          Refund eligibility depends on what you purchased. For a phone number: if no code arrives within the
          waiting window, or you cancel before one arrives, the charge is refunded automatically. For a generated
          email address, the charge is not refunded once made — whether a code arrives, the wait times out, or you
          cancel it yourself — since the address itself has already been provisioned. Once a code has been
          delivered to either, the charge is final. Current details are shown in the product itself and in our{" "}
          <Link href="/faq" className="font-medium text-violet-600 hover:underline dark:text-violet-300">
            FAQ
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="5. Acceptable use">
        <p>You agree not to use Reline to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Commit fraud, impersonate someone else, or evade a platform's identity or anti-abuse checks unlawfully</li>
          <li>Violate the terms of service of the platform you're verifying with</li>
          <li>Send spam, harass anyone, or engage in any illegal activity</li>
          <li>Attempt to interfere with, disrupt, or gain unauthorized access to Reline's systems</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts we reasonably believe are being used to break these
          rules, without a refund of any wallet balance tied to the violation.
        </p>
      </LegalSection>

      <LegalSection heading="6. Referral program">
        <p>
          If you participate in our referral program, you earn a percentage of the top-ups made by people who sign
          up using your referral link, for as long as their account remains active and in good standing. We may
          adjust the referral rate or terms going forward, and may withhold or reverse referral earnings obtained
          through fraudulent signups or abuse of the program.
        </p>
      </LegalSection>

      <LegalSection heading="7. Service availability">
        <p>
          Reline depends on third-party number and email providers, our payment processor, and other infrastructure
          we don't fully control. We don't guarantee uninterrupted or error-free service, and we're not liable for
          outages or failures caused by those third parties.
        </p>
      </LegalSection>

      <LegalSection heading="8. Limitation of liability">
        <p>
          To the fullest extent permitted by law, Reline and its owners aren't liable for indirect, incidental, or
          consequential damages arising from your use of the service, including loss of access to a third-party
          account. Our total liability for any claim is limited to the amount you paid us in the three months before
          the claim arose.
        </p>
      </LegalSection>

      <LegalSection heading="9. Termination">
        <p>
          You can stop using Reline and close your account at any time. We may suspend or terminate your account for
          violating these Terms or applicable law. Wallet balances tied to a violation may be forfeited; otherwise,
          contact us about any remaining balance on account closure.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to these terms">
        <p>
          We may update these Terms from time to time. If we make material changes, we'll update the date at the top
          of this page. Continuing to use Reline after changes take effect means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection heading="11. Governing law">
        <p>These Terms are governed by the laws of the Federal Republic of Nigeria.</p>
      </LegalSection>

      <LegalSection heading="12. Contact">
        <p>
          Questions about these Terms? Reach us at{" "}
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

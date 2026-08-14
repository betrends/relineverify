import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageBackdrop from "@/components/motion/PageBackdrop";
import Reveal from "@/components/motion/Reveal";
import StepBadge from "@/components/motion/StepBadge";
import ServiceIcon from "@/components/ServiceIcon";
import { getServiceLanding } from "@/lib/seoLanding";

// Can't be statically generated (SSG/ISR): this app resolves i18n locale
// via cookies() in the root layout (see src/i18n/request.ts), which forces
// every page — including this one — to render dynamically per request.
// Attempting generateStaticParams here built fine but crashed at runtime
// in production (DYNAMIC_SERVER_USAGE). getServiceLanding itself is
// bounded by a timeout (see lib/seoLanding.ts) so a slow upstream call
// degrades to a 404 instead of hanging the request — maxDuration gives it
// real room to succeed on an uncached first hit instead of being cut off
// by Vercel's default function timeout before that inner timeout fires.
export const maxDuration = 60;

const appUrl = process.env.APP_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getServiceLanding(params.slug).catch(() => null);
  if (!data) return { title: "Service not found — Reline" };

  const { service, priceFrom } = data;
  const title = `Buy a Virtual Number for ${service.name} Verification — Reline`;
  const description = `Get an instant virtual phone number to verify ${service.name}. No SIM card needed — pay in Naira, receive your code in seconds.${
    priceFrom ? ` From ₦${priceFrom.toLocaleString()}.` : ""
  }`;

  return {
    title,
    description,
    alternates: { canonical: `${appUrl}/services/${params.slug}` },
    openGraph: { title, description, url: `${appUrl}/services/${params.slug}` },
  };
}

const STEPS = (serviceName: string) => [
  { title: "Fund your wallet", body: "Top up with Korapay — card, bank transfer, or USSD. Naira in, seconds later." },
  { title: `Pick ${serviceName} and a country`, body: "Your virtual number appears instantly, ready to receive the OTP." },
  { title: "Read the code", body: "It lands in your dashboard the moment it arrives. Copy it, paste it, done." },
];

function faqsFor(serviceName: string) {
  return [
    {
      q: `How do I verify ${serviceName} with Reline?`,
      a: `Sign up, top up your wallet, then pick ${serviceName} and a country — your number appears instantly and the code lands in your dashboard within seconds.`,
    },
    {
      q: "Is the number reusable?",
      a: "No — each number is single-use per order, so it's always clean for your verification and can't have been flagged by a previous user.",
    },
    {
      q: "What if I don't receive a code?",
      a: "If nothing arrives before the order times out, it's automatically cancelled and refunded straight back to your wallet — no code, no charge.",
    },
  ];
}

export default async function ServiceLandingPage({ params }: { params: { slug: string } }) {
  const data = await getServiceLanding(params.slug).catch(() => null);
  if (!data) notFound();

  const { service, priceFrom } = data;
  const faqs = faqsFor(service.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} Verification Number`,
    description: `Instant virtual phone number for ${service.name} SMS verification, delivered in seconds.`,
    provider: { "@type": "Organization", name: "Reline", url: appUrl },
    areaServed: "NG",
    ...(priceFrom
      ? { offers: { "@type": "Offer", price: priceFrom, priceCurrency: "NGN", url: `${appUrl}/services/${params.slug}` } }
      : {}),
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-paper-100">
      <PageBackdrop />
      <SiteNav />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <nav className="text-sm text-slate-400 dark:text-slate-500">
          <Link href="/services" className="hover:text-violet-600 dark:hover:text-violet-300">
            Services
          </Link>{" "}
          / {service.name}
        </nav>

        <Reveal className="mt-4">
          <div className="flex items-center gap-4">
            <ServiceIcon name={service.name} className="h-14 w-14 shrink-0 rounded-2xl" />
            <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100 sm:text-4xl">
              Buy a Virtual Number for {service.name} Verification
            </h1>
          </div>
          <p className="mt-5 leading-relaxed text-slate-500 dark:text-slate-400">
            Get an instant virtual phone number to receive your {service.name} SMS verification code — no SIM card,
            no second phone, no waiting. Pay in Naira, get a number in seconds, and read your code the moment it
            lands in your Reline dashboard.
          </p>
        </Reveal>

        {priceFrom !== null && (
          <Reveal delay={0.05} className="mt-6">
            <div className="flex items-center justify-between rounded-2xl border border-violet-100 bg-white/70 px-6 py-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/40">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Starting from</p>
                <p className="font-display text-2xl font-700 text-slate-900 dark:text-paper-100">
                  ₦{priceFrom.toLocaleString()}
                </p>
              </div>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2.5 font-medium text-white shadow-[0_0_0_0_rgba(124,92,252,0.5)] transition-all hover:shadow-[0_0_20px_2px_rgba(124,92,252,0.35)] focus-ring"
              >
                Get started
              </Link>
            </div>
            <p className="mt-2 text-xs text-slate-400">Exact price shown at checkout — it can vary slightly by country.</p>
          </Reveal>
        )}

        <Reveal delay={0.1} className="mt-12">
          <h2 className="font-display text-xl font-700 text-slate-900 dark:text-paper-100">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {STEPS(service.name).map((step, i) => (
              <div key={step.title}>
                <StepBadge number={String(i + 1).padStart(2, "0")} showLine={i < 2} />
                <p className="mt-3 font-medium text-slate-900 dark:text-paper-100">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <h2 className="font-display text-xl font-700 text-slate-900 dark:text-paper-100">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-violet-100 rounded-2xl border border-violet-100 bg-white/70 backdrop-blur-xl dark:divide-white/10 dark:border-white/10 dark:bg-ink-900/40">
            {faqs.map((faq) => (
              <details key={faq.q} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-medium text-slate-900 marker:content-none dark:text-paper-100">
                  {faq.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 rounded-2xl border border-violet-100 bg-white/70 p-8 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/40">
          <p className="font-display text-xl font-700 text-slate-900 dark:text-paper-100">
            Ready to verify {service.name}?
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-block rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-medium text-white shadow-[0_0_0_0_rgba(124,92,252,0.5)] transition-all hover:shadow-[0_0_20px_2px_rgba(124,92,252,0.35)] focus-ring"
          >
            Create your free account
          </Link>
          <p className="mt-4 text-sm">
            <Link href="/countries" className="text-violet-600 hover:underline dark:text-violet-300">
              Browse available countries
            </Link>
            {" · "}
            <Link href="/services" className="text-violet-600 hover:underline dark:text-violet-300">
              See all services
            </Link>
          </p>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageBackdrop from "@/components/motion/PageBackdrop";
import Reveal from "@/components/motion/Reveal";
import StepBadge from "@/components/motion/StepBadge";
import ServiceIcon from "@/components/ServiceIcon";
import { countryCodeToFlag } from "@/lib/countryFlag";
import { getCountryLanding, getPopularCountrySlugs, slugify } from "@/lib/seoLanding";

export const revalidate = 3600;
export const dynamicParams = true;

const appUrl = process.env.APP_URL || "http://localhost:3000";

export async function generateStaticParams() {
  const slugs = await getPopularCountrySlugs(60).catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getCountryLanding(params.slug).catch(() => null);
  if (!data) return { title: "Country not found — Reline" };

  const { country } = data;
  const title = `Virtual Phone Numbers from ${country.name} — Reline`;
  const description = `Rent a virtual phone number from ${country.name} to verify WhatsApp, Telegram, Google and hundreds more. Pay in Naira, receive your code in seconds.`;

  return {
    title,
    description,
    alternates: { canonical: `${appUrl}/countries/${params.slug}` },
    openGraph: { title, description, url: `${appUrl}/countries/${params.slug}` },
  };
}

function faqsFor(countryName: string) {
  return [
    {
      q: `Are ${countryName} numbers really instant?`,
      a: "Yes — the number is assigned the moment you buy it, and most verification codes land within 2–10 seconds after that.",
    },
    {
      q: "What if the service I need isn't listed here?",
      a: "This page only shows a handful of popular examples — your dashboard has the full live catalog for this country once you're signed in.",
    },
    {
      q: "Do unused numbers get refunded?",
      a: "Yes. If no code arrives before the order times out, it's automatically cancelled and refunded straight back to your wallet.",
    },
  ];
}

export default async function CountryLandingPage({ params }: { params: { slug: string } }) {
  const data = await getCountryLanding(params.slug).catch(() => null);
  if (!data) notFound();

  const { country, popularServices } = data;
  const faqs = faqsFor(country.name);
  const flag = countryCodeToFlag(country.code);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Virtual Phone Numbers from ${country.name}`,
    description: `Instant virtual phone numbers from ${country.name} for SMS verification across hundreds of platforms.`,
    provider: { "@type": "Organization", name: "Reline", url: appUrl },
    areaServed: country.name,
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
          <Link href="/countries" className="hover:text-violet-600 dark:hover:text-violet-300">
            Countries
          </Link>{" "}
          / {country.name}
        </nav>

        <Reveal className="mt-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl leading-none" aria-hidden>
              {flag}
            </span>
            <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100 sm:text-4xl">
              Virtual Phone Numbers from {country.name}
            </h1>
          </div>
          <p className="mt-5 leading-relaxed text-slate-500 dark:text-slate-400">
            Rent an instant virtual phone number from {country.name} to receive SMS verification codes for
            WhatsApp, Telegram, Google, and hundreds of other platforms — no local SIM card required. Pay in
            Naira and get your number in seconds.
          </p>
        </Reveal>

        {popularServices.length > 0 && (
          <Reveal delay={0.05} className="mt-10">
            <h2 className="font-display text-xl font-700 text-slate-900 dark:text-paper-100">
              Popular services from {country.name}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {popularServices.map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${slugify(s.name)}`}
                  className="flex items-center justify-between rounded-xl border border-violet-100 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl transition-colors hover:bg-white dark:border-white/10 dark:bg-ink-900/40 dark:hover:bg-ink-900/70"
                >
                  <span className="flex items-center gap-3">
                    <ServiceIcon name={s.name} className="h-9 w-9 rounded-lg" />
                    <span className="font-medium text-slate-900 dark:text-paper-100">{s.name}</span>
                  </span>
                  <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                    ₦{s.priceCharged.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1} className="mt-12">
          <h2 className="font-display text-xl font-700 text-slate-900 dark:text-paper-100">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Fund your wallet", body: "Top up with Korapay — card, bank transfer, or USSD. Naira in, seconds later." },
              { title: `Pick a service and ${country.name}`, body: "Your virtual number appears instantly, ready to receive the OTP." },
              { title: "Read the code", body: "It lands in your dashboard the moment it arrives. Copy it, paste it, done." },
            ].map((step, i) => (
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
            Ready to get a number from {country.name}?
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-block rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-medium text-white shadow-[0_0_0_0_rgba(124,92,252,0.5)] transition-all hover:shadow-[0_0_20px_2px_rgba(124,92,252,0.35)] focus-ring"
          >
            Create your free account
          </Link>
          <p className="mt-4 text-sm">
            <Link href="/services" className="text-violet-600 hover:underline dark:text-violet-300">
              See all services
            </Link>
            {" · "}
            <Link href="/countries" className="text-violet-600 hover:underline dark:text-violet-300">
              Browse all countries
            </Link>
          </p>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

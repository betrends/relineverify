import { useTranslations } from "next-intl";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageBackdrop from "@/components/motion/PageBackdrop";
import HeroContent from "@/components/motion/HeroContent";
import HeroDemoCard from "@/components/motion/HeroDemoCard";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import CountUpStat from "@/components/motion/CountUpStat";
import StepBadge from "@/components/motion/StepBadge";
import CursorSpotlight from "@/components/motion/CursorSpotlight";
import YoutubeEmbed from "@/components/motion/YoutubeEmbed";
import { countryCodeToFlag } from "@/lib/countryFlag";
import { getSetting } from "@/lib/siteSettings";

const STEP_KEYS = ["step1", "step2", "step3"] as const;
const TRUST_STATS = [
  { value: "2.8M", key: "otps" },
  { value: "180+", key: "services" },
  { value: "99.3%", key: "successRate" },
  { value: "4s", key: "avgDelivery" },
] as const;

const TESTIMONIALS = [
  {
    name: "Chidinma A.",
    initials: "CA",
    bg: "bg-violet-500",
    country: "ng",
    countryName: "Nigeria",
    rating: 5,
    quote: "Got my WhatsApp code in under 5 seconds. Way cheaper than buying a new SIM every time.",
  },
  {
    name: "Kwame O.",
    initials: "KO",
    bg: "bg-emerald-500",
    country: "gh",
    countryName: "Ghana",
    rating: 5,
    quote: "I verify Telegram accounts for work daily — Reline has never let me down.",
  },
  {
    name: "Fatima B.",
    initials: "FB",
    bg: "bg-blue-500",
    country: "ng",
    countryName: "Nigeria",
    rating: 5,
    quote: "The email option saved me when a number wasn't working. Instant, no stress.",
  },
  {
    name: "David T.",
    initials: "DT",
    bg: "bg-amber-500",
    country: "ke",
    countryName: "Kenya",
    rating: 4,
    quote: "Solid service, fair prices. Support replied within minutes when I had a question.",
  },
  {
    name: "Ngozi E.",
    initials: "NE",
    bg: "bg-rose-500",
    country: "ng",
    countryName: "Nigeria",
    rating: 5,
    quote: "Best virtual number service I've used in Nigeria. Codes land almost instantly.",
  },
  {
    name: "Samuel K.",
    initials: "SK",
    bg: "bg-sky-500",
    country: "za",
    countryName: "South Africa",
    rating: 5,
    quote: "Paid with my bank card, had a number in seconds. Exactly what I needed for testing.",
  },
];

export default function LandingPage() {
  const how = useTranslations("how");
  const trust = useTranslations("trust");
  const reviews = useTranslations("reviews");

  return (
    <div className="min-h-screen text-slate-900 dark:text-paper-100">
      <PageBackdrop />
      <SiteNav />

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-20">
        <CursorSpotlight className="grid items-center gap-16 lg:grid-cols-2">
          <HeroContent />
          <HeroDemoCard />
        </CursorSpotlight>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">{how("heading")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {STEP_KEYS.map((step, i) => (
            <Reveal key={step} delay={i * 0.1}>
              <TiltCard className="h-full rounded-3xl border border-violet-100 bg-white/70 p-6 shadow-[0_8px_32px_-12px_rgba(124,92,252,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/40">
                <StepBadge number={String(i + 1).padStart(2, "0")} showLine={i < STEP_KEYS.length - 1} />
                <h3 className="mt-4 font-display text-xl font-700 text-slate-900 dark:text-paper-100">
                  {how(`${step}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{how(`${step}Body`)}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <TutorialVideoSection />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <div className="grid divide-y divide-slate-200/70 rounded-3xl border border-violet-100 bg-white/70 shadow-[0_8px_32px_-12px_rgba(124,92,252,0.15)] backdrop-blur-xl dark:divide-white/10 dark:border-white/10 dark:bg-ink-900/40 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {TRUST_STATS.map((s, i) => (
              <div key={s.key} className="px-6 py-8 text-center">
                <CountUpStat
                  target={s.value}
                  className="block bg-gradient-to-br from-violet-600 to-blue-500 bg-clip-text font-display text-4xl font-700 tabular-nums text-transparent dark:from-violet-300 dark:to-blue-300 sm:text-5xl"
                />
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{trust(s.key)}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
            {reviews("heading")}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{reviews("subtext")}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((review, i) => (
            <Reveal key={review.name} delay={i * 0.06}>
              <TiltCard className="h-full rounded-3xl border border-violet-100 bg-white/70 p-6 shadow-[0_8px_32px_-12px_rgba(124,92,252,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/40">
                <StarRating rating={review.rating} />
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${review.bg}`}
                  >
                    {review.initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-paper-100">{review.name}</p>
                    <p className="text-xs text-slate-400">
                      {countryCodeToFlag(review.country)} {review.countryName}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// A separate async component (rather than making LandingPage itself
// async) — mixing next-intl's client-hook-shaped useTranslations() with
// await in the same Server Component broke React's RSC rendering
// ("Expected a suspended thenable", surfaced only in a real production
// build, not `next dev`). An async child component sidesteps it cleanly.
async function TutorialVideoSection() {
  const tutorialVideoUrl = await getSetting("tutorialVideoUrl");
  if (!tutorialVideoUrl) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Reveal>
        <h2 className="text-center font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
          Watch how it works
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          A quick walkthrough of getting a virtual number or email on Reline.
        </p>
        <div className="mt-8">
          <YoutubeEmbed url={tutorialVideoUrl} title="How to get virtual numbers and emails on Reline" />
        </div>
      </Reveal>
    </section>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2">
          <path d="M10 2.5 12.4 7.4 17.8 8.2 13.9 12 14.9 17.4 10 14.8 5.1 17.4 6.1 12 2.2 8.2 7.6 7.4 10 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

import SiteNav from "@/components/SiteNav";
import HeroBackground from "@/components/motion/HeroBackground";
import HeroContent from "@/components/motion/HeroContent";
import HeroDemoCard from "@/components/motion/HeroDemoCard";
import Reveal from "@/components/motion/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Fund your wallet",
    body: "Top up with Korapay — card, bank transfer, or USSD. Naira in, seconds later.",
  },
  {
    n: "02",
    title: "Pick a number",
    body: "Choose a country and the service you're verifying — WhatsApp, Telegram, and hundreds more.",
  },
  {
    n: "03",
    title: "Read the code",
    body: "Your code lands in your dashboard the moment it arrives. Copy it, paste it, done.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteNav />

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-20">
        <HeroBackground />
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <HeroContent />
          <HeroDemoCard />
        </div>
      </section>

      <section id="how" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-700 tracking-tight text-slate-900">How it works</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <div>
                  <p className="font-mono text-sm text-violet-600">{step.n}</p>
                  <h3 className="mt-3 font-display text-xl font-700 text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-slate-500">
          Reline · virtual numbers for SMS verification · payments via Korapay
        </div>
      </footer>
    </div>
  );
}

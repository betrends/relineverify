"use client";

import { motion } from "framer-motion";
import Reveal from "../motion/Reveal";
import LiveFeedCard from "../motion/LiveFeedCard";

const STATS = [
  { value: "2.3s", label: "Avg. Delivery", icon: <BoltIcon /> },
  { value: "150+", label: "Countries", icon: <GlobeIcon /> },
  { value: "500+", label: "Services", icon: <ShieldIcon /> },
  { value: "99.9%", label: "Success Rate", icon: <TrendIcon /> },
];

const AVATARS = [
  { initials: "JD", bg: "bg-violet-500" },
  { initials: "AK", bg: "bg-emerald-500" },
  { initials: "MS", bg: "bg-blue-500" },
  { initials: "TO", bg: "bg-amber-500" },
];

export default function SignupHero() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-y-auto overflow-x-hidden bg-gradient-to-b from-violet-50/70 via-white to-white px-8 py-10 dark:from-ink-900 dark:via-ink-950 dark:to-ink-950 lg:px-14 lg:py-12">
      <OrbitBackground />

      <div className="relative">
        <Reveal>
          <a href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-white">
              <BoltIcon />
            </span>
            <span className="font-display text-xl font-700 text-slate-900 dark:text-paper-100">Reline</span>
          </a>
        </Reveal>

        <Reveal delay={0.05} className="mt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-violet-600 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            <BoltIcon className="h-3 w-3" />
            Fast. Private. Reliable.
          </span>
        </Reveal>

        <Reveal delay={0.1} className="mt-3">
          <h1 className="font-display text-4xl font-700 leading-tight tracking-tight text-slate-900 dark:text-paper-100 lg:text-5xl">
            Get verified <br />
            in <span className="text-violet-600 dark:text-violet-300">seconds.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.15} className="mt-3">
          <p className="max-w-md text-slate-500 dark:text-slate-400">
            Rent virtual phone numbers or generate temporary email addresses for WhatsApp, Telegram, Google
            and 500+ services. Receive codes instantly. No SIM required.
          </p>
        </Reveal>
      </div>

      <div className="relative flex flex-1 items-center justify-center py-4">
        <LiveFeedCard />
      </div>

      <div className="relative mt-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {AVATARS.map((a) => (
              <span
                key={a.initials}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white dark:border-ink-950 ${a.bg}`}
              >
                {a.initials}
              </span>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">4.9/5 from 2,000+ reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-violet-100 bg-white/60 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/40">
          {STATS.map((s) => (
            <div key={s.label}>
              <span className="text-violet-500 dark:text-violet-300">{s.icon}</span>
              <p className="mt-1 font-display text-lg font-700 text-slate-900 dark:text-paper-100">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Reline. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function OrbitBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <motion.div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-200/35 blur-[100px] dark:bg-violet-500/15"
        animate={{ x: [0, 30, -10, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-200/30 blur-[100px] dark:bg-blue-500/10"
        animate={{ x: [0, -20, 10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200/20 blur-[110px] dark:bg-fuchsia-500/10"
        animate={{ x: [0, 20, -20, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function BoltIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path d="M11 2 4 12h5l-1 6 7-10h-5l1-6Z" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2.5 16 5v5c0 4-2.5 6.5-6 7.5-3.5-1-6-3.5-6-7.5V5l6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7.3 10 9 11.7 12.7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h14M10 3c2 2 3 4.5 3 7s-1 5-3 7c-2-2-3-4.5-3-7s1-5 3-7Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 13.5 8 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 5h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2.5 12.4 7.4 17.8 8.2 13.9 12 14.9 17.4 10 14.8 5.1 17.4 6.1 12 2.2 8.2 7.6 7.4 10 2.5Z" />
    </svg>
  );
}


"use client";

import { motion } from "framer-motion";
import Reveal from "../motion/Reveal";
import OtpReadout from "../OtpReadout";

const FEATURES = [
  {
    title: "Instant Delivery",
    bg: "bg-violet-50",
    color: "text-violet-600",
    darkBg: "dark:bg-violet-500/10",
    darkColor: "dark:text-violet-300",
    icon: <BoltIcon />,
    pos: "-left-2 -top-6",
  },
  {
    title: "Private & Secure",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    darkBg: "dark:bg-emerald-500/10",
    darkColor: "dark:text-emerald-300",
    icon: <ShieldIcon />,
    pos: "-right-2 -top-10",
  },
  {
    title: "Global Coverage",
    bg: "bg-blue-50",
    color: "text-blue-600",
    darkBg: "dark:bg-blue-500/10",
    darkColor: "dark:text-blue-300",
    icon: <GlobeIcon />,
    pos: "-left-2 -bottom-6",
  },
];

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
            Rent virtual phone numbers for WhatsApp, Telegram, Google and 500+ services. Receive OTPs
            instantly. No SIM required.
          </p>
        </Reveal>
      </div>

      <div className="relative flex flex-1 items-center justify-center py-4">
        <CodeCardIllustration />
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

        <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-4 dark:border-ink-800">
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

function CodeCardIllustration() {
  const bubbles = [
    { label: "TG", bg: "bg-sky-500 text-white", pos: "left-1/2 -top-2 -translate-x-1/2", icon: <PaperPlaneIcon /> },
    { label: "TT", bg: "bg-slate-900 text-white", pos: "right-0 top-1/2 -translate-y-1/2", icon: <MusicNoteIcon /> },
    { label: "WA", bg: "bg-emerald-500 text-white", pos: "left-0 top-1/2 -translate-y-1/2", icon: <ChatIcon /> },
    { label: "GO", bg: "bg-white text-blue-500 border-2 border-slate-200", pos: "left-1/2 -bottom-2 -translate-x-1/2", icon: "G" },
    { label: "DC", bg: "bg-indigo-500 text-white", pos: "right-2 -bottom-3", icon: <ControllerIcon /> },
  ];

  return (
    <div className="relative mx-auto w-full max-w-sm py-8">
      <svg className="absolute -inset-16 -z-10 text-violet-100" viewBox="0 0 300 300" fill="none" preserveAspectRatio="none">
        <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx="150" cy="150" r="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
      </svg>

      {FEATURES.map((f) => (
        <motion.div
          key={f.title}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
          className={`absolute z-10 ${f.pos} flex w-20 flex-col items-center gap-1.5 text-center`}
        >
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md ${f.bg} ${f.color} ${f.darkBg} ${f.darkColor}`}
          >
            {f.icon}
          </span>
          <span className="text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-300">{f.title}</span>
        </motion.div>
      ))}

      {bubbles.map((b) => (
        <motion.span
          key={b.label}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
          className={`absolute z-10 ${b.pos} flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold shadow-md ${b.bg}`}
        >
          {b.icon}
        </motion.span>
      ))}

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 mx-auto w-full max-w-[16rem] rounded-[24px] border border-slate-100 bg-white p-5 shadow-xl dark:border-ink-700 dark:bg-ink-900"
      >
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 dark:border-ink-800">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500 text-white">
            <BoltIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-paper-100">Reline</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-600 dark:text-mint-400">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulseDot" />
            live
          </span>
        </div>
        <div className="py-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Your verification code</p>
          <OtpReadout resolved="482 913" length={7} className="mt-2 text-3xl text-slate-900 dark:text-paper-100" />
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckIcon />
          Received in 2.3s
        </div>
      </motion.div>
    </div>
  );
}

function OrbitBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-200/30 blur-[100px]"
        animate={{ x: [0, 30, -10, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-200/20 blur-[100px]"
        animate={{ x: [0, -20, 10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
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

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.15" />
      <path d="M6.5 10.3 9 12.8 13.8 7.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="m3 10.3 13-5.4c.6-.3 1.2.2 1 .9l-2.2 10.6c-.2.8-1 1-1.6.6l-3.5-2.6-1.8 1.8c-.2.2-.5.2-.6-.1l-.4-3 8-6.6-9.5 5.4-2.1-.7c-.7-.2-.8-1 .1-1.3Z" fill="currentColor" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 3a7 7 0 0 0-6 10.6L3 17l3.5-1a7 7 0 1 0 3.5-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function MusicNoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="M8 15a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M10.2 12.8V3.5c1 1.6 2.5 2.5 4.3 2.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ControllerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="7" width="14" height="8" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 9v4M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="10" r="0.9" fill="currentColor" />
      <circle cx="14.5" cy="12.3" r="0.9" fill="currentColor" />
    </svg>
  );
}

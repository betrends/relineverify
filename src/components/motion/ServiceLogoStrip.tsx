"use client";

import { motion } from "framer-motion";

const SERVICES = [
  { name: "WhatsApp", icon: <WhatsAppIcon />, bg: "bg-emerald-500" },
  { name: "Telegram", icon: <TelegramIcon />, bg: "bg-sky-500" },
  { name: "Google", icon: <GoogleIcon />, bg: "bg-white border-2 border-slate-200" },
  { name: "Discord", icon: <DiscordIcon />, bg: "bg-indigo-500" },
  { name: "Email", icon: <MailIcon />, bg: "bg-blue-500" },
  { name: "TikTok", icon: <TikTokIcon />, bg: "bg-slate-900" },
] as const;

// A calm, lined-up row of the services Reline verifies for — swapped in
// for the earlier scattered floating-icon treatment, which read as too
// busy/random. Each icon still gets a tiny hover lift so it isn't inert.
export default function ServiceLogoStrip() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Works with
      </span>
      <div className="flex items-center gap-3">
        {SERVICES.map((s, i) => (
          <motion.span
            key={s.name}
            title={s.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: "easeOut" }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm ${s.bg}`}
          >
            {s.icon}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 3a7 7 0 0 0-6 10.6L3 17l3.5-1a7 7 0 1 0 3.5-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="m3 10.3 13-5.4c.6-.3 1.2.2 1 .9l-2.2 10.6c-.2.8-1 1-1.6.6l-3.5-2.6-1.8 1.8c-.2.2-.5.2-.6-.1l-.4-3 8-6.6-9.5 5.4-2.1-.7c-.7-.2-.8-1 .1-1.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon() {
  return <span className="text-[13px] font-700 text-blue-500">G</span>;
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="7" width="14" height="8" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 9v4M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="10" r="0.9" fill="currentColor" />
      <circle cx="14.5" cy="12.3" r="0.9" fill="currentColor" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.2 5.5 6.8 5 6.8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M8 15a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.2 12.8V3.5c1 1.6 2.5 2.5 4.3 2.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

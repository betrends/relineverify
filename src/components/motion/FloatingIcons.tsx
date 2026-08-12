"use client";

import { motion } from "framer-motion";

// Small service-brand bubbles drifting slowly around the hero — purely
// decorative, reinforcing "verification for lots of services" with gentle
// constant motion rather than another live-data ticker. Hidden below lg:
// there's no spare room around the hero content on smaller screens.
const ICONS = [
  { icon: <WhatsAppIcon />, bg: "bg-emerald-500", top: "8%", left: "2%", duration: 7, delay: 0 },
  { icon: <TelegramIcon />, bg: "bg-sky-500", top: "68%", left: "-2%", duration: 8, delay: 0.6 },
  { icon: <GoogleIcon />, bg: "bg-white border-2 border-slate-200", top: "18%", left: "94%", duration: 9, delay: 0.3 },
  { icon: <DiscordIcon />, bg: "bg-indigo-500", top: "80%", left: "90%", duration: 7.5, delay: 1 },
  { icon: <MailIcon />, bg: "bg-blue-500", top: "45%", left: "97%", duration: 8.5, delay: 0.9 },
] as const;

export default function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 hidden overflow-hidden lg:block">
      {ICONS.map((item, i) => (
        <motion.span
          key={i}
          className={`absolute flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg ${item.bg}`}
          style={{ top: item.top, left: item.left }}
          animate={{ y: [0, -18, 0], x: [0, 8, 0], rotate: [0, 5, 0] }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {item.icon}
        </motion.span>
      ))}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 3a7 7 0 0 0-6 10.6L3 17l3.5-1a7 7 0 1 0 3.5-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="m3 10.3 13-5.4c.6-.3 1.2.2 1 .9l-2.2 10.6c-.2.8-1 1-1.6.6l-3.5-2.6-1.8 1.8c-.2.2-.5.2-.6-.1l-.4-3 8-6.6-9.5 5.4-2.1-.7c-.7-.2-.8-1 .1-1.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon() {
  return <span className="text-sm font-700 text-blue-500">G</span>;
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="7" width="14" height="8" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 9v4M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="10" r="0.9" fill="currentColor" />
      <circle cx="14.5" cy="12.3" r="0.9" fill="currentColor" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.2 5.5 6.8 5 6.8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

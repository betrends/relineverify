"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FEED_EVENTS = [
  { service: "WhatsApp", icon: <ChatIcon />, bg: "bg-emerald-500 text-white", code: "482 913" },
  { service: "Telegram", icon: <PaperPlaneIcon />, bg: "bg-sky-500 text-white", code: "719 044" },
  { service: "Email", icon: <MailIcon />, bg: "bg-blue-500 text-white", code: "271 048" },
  { service: "Google", icon: <span className="text-[13px] font-700">G</span>, bg: "bg-white text-blue-500 border-2 border-slate-200", code: "550 217" },
  { service: "TikTok", icon: <MusicNoteIcon />, bg: "bg-slate-900 text-white", code: "093 481" },
  { service: "Email", icon: <MailIcon />, bg: "bg-blue-500 text-white", code: "638 204" },
  { service: "Discord", icon: <ControllerIcon />, bg: "bg-indigo-500 text-white", code: "415 067" },
  { service: "Telegram", icon: <PaperPlaneIcon />, bg: "bg-sky-500 text-white", code: "902 156" },
];

const AGO_LABELS = ["Just now", "6 sec ago", "14 sec ago", "23 sec ago", "35 sec ago"];

type FeedRow = (typeof FEED_EVENTS)[number] & { key: number };

export default function LiveFeedCard({ className = "" }: { className?: string }) {
  const [rows, setRows] = useState<FeedRow[]>(() =>
    FEED_EVENTS.slice(0, AGO_LABELS.length).map((e, i) => ({ ...e, key: i }))
  );
  const [toastKey, setToastKey] = useState<number | null>(null);
  const nextIndex = useRef(AGO_LABELS.length % FEED_EVENTS.length);

  useEffect(() => {
    const id = setInterval(() => {
      const newRow: FeedRow = { ...FEED_EVENTS[nextIndex.current], key: Date.now() };
      nextIndex.current = (nextIndex.current + 1) % FEED_EVENTS.length;
      setRows((prev) => [newRow, ...prev].slice(0, AGO_LABELS.length));
      setToastKey(newRow.key);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (toastKey === null) return;
    const t = setTimeout(() => setToastKey(null), 1800);
    return () => clearTimeout(t);
  }, [toastKey]);

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={`relative mx-auto w-full ${className}`}
    >
      <div className="mb-3 flex justify-center">
        <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/60 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-ink-800/60 dark:text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          New code every few seconds
        </div>
      </div>

      <div className="relative h-[clamp(18rem,42vh,28rem)] w-full overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/60">
        <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
          {/* A single, always-mounted element toggled via `animate` — conditionally
              mounting/unmounting this through AnimatePresence left orphaned,
              zero-opacity copies behind in the DOM on every tick (never actually
              removed), so state is interpolated in place instead. */}
          <motion.div
            animate={
              toastKey !== null
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: -6, scale: 0.97 }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-paper-100 dark:text-ink-950"
          >
            🔔 New code received
          </motion.div>
        </div>

        <div className="space-y-2 px-3 pb-3 pt-6">
          <AnimatePresence initial={false}>
            {rows.map((e, i) => (
              <motion.div
                key={e.key}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-ink-900/50"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${e.bg}`}>
                  {e.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 truncate text-[10px] text-slate-400">
                    <CheckIcon />
                    {e.service} · Received {AGO_LABELS[i] ?? AGO_LABELS[AGO_LABELS.length - 1]}
                  </p>
                  <p className="font-mono text-base font-700 tracking-wider text-slate-900 dark:text-paper-100">
                    {e.code}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white/70 to-transparent dark:from-ink-900/60" />
      </div>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 20 20" fill="none" className="shrink-0 text-emerald-500">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
      <path d="M6 10.3 8.7 13 14 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.2 5.5 6.8 5 6.8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M8 15a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" stroke="currentColor" strokeWidth="1.5" />
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

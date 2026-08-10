"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// A believable "today" baseline derived from the 2.8M-delivered trust
// stat — ticks up every few seconds like OTPs are landing live, the same
// spirit as LiveFeedCard but as a compact standalone badge for the hero.
function todaysBaseline(): number {
  const now = new Date();
  const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const perSecondRate = 2_800_000 / (30 * 24 * 3600); // spread 2.8M across a 30-day month
  return Math.round(1200 + secondsSinceMidnight * perSecondRate);
}

export default function LiveCounterBadge() {
  const t = useTranslations("hero");
  const [count, setCount] = useState<number | null>(null);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    setCount(todaysBaseline());
    const id = setInterval(() => {
      setCount((c) => (c ?? todaysBaseline()) + Math.ceil(Math.random() * 3));
      setBump(true);
      setTimeout(() => setBump(false), 300);
    }, 2600 + Math.random() * 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-ink-700 dark:bg-ink-900 dark:text-slate-300"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <motion.span
        animate={bump ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="font-mono tabular-nums text-slate-900 dark:text-paper-100"
      >
        {count === null ? "—" : count.toLocaleString()}
      </motion.span>
      <span>{t("liveCounter")}</span>
    </motion.div>
  );
}

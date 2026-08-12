"use client";

import { motion } from "framer-motion";

// A calmer cousin of PageBackdrop — same aurora-mesh language as the
// marketing site, but slower and lower-opacity, since this sits behind a
// screen people actually work in for minutes at a time rather than glance
// at once. No grid overlay either — it competes with dashboard tables.
export default function DashboardBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-ink-950">
      <motion.div
        className="absolute -top-40 left-[-10%] h-[440px] w-[440px] rounded-full bg-violet-200/25 blur-[140px] dark:bg-violet-500/10"
        animate={{ x: [0, 30, -15, 0], y: [0, 25, -10, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] top-1/3 h-[400px] w-[400px] rounded-full bg-blue-200/20 blur-[140px] dark:bg-blue-500/10"
        animate={{ x: [0, -25, 15, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-1/4 h-[380px] w-[380px] rounded-full bg-violet-100/25 blur-[130px] dark:bg-violet-400/5"
        animate={{ x: [0, 20, -20, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

// Fixed, full-viewport aurora mesh that sits behind the ENTIRE page (not
// just the hero) so glass cards further down the page have something
// colorful to blur — otherwise "frosted glass" over a flat white/ink
// background just looks like a plain bordered box. Provides the page's
// base background color itself (callers should leave their own wrapper
// transparent) so there's exactly one paint layer behind everything.
export default function PageBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white dark:bg-ink-950">
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <motion.div
        className="absolute -top-40 left-[-15%] h-[520px] w-[520px] rounded-full bg-violet-300/35 blur-[130px] dark:bg-violet-500/15"
        animate={{ x: [0, 50, -20, 0], y: [0, 40, -10, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-15%] top-0 h-[460px] w-[460px] rounded-full bg-blue-300/30 blur-[130px] dark:bg-blue-500/10"
        animate={{ x: [0, -40, 25, 0], y: [0, -25, 20, 0], scale: [1, 0.94, 1.1, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/4 top-[55%] h-[380px] w-[380px] rounded-full bg-fuchsia-300/20 blur-[120px] dark:bg-fuchsia-500/10"
        animate={{ x: [0, 25, -35, 0], y: [0, -35, 15, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-1/4 top-[85%] h-[360px] w-[360px] rounded-full bg-violet-200/25 blur-[110px] dark:bg-violet-400/10"
        animate={{ x: [0, -20, 30, 0], y: [0, 20, -25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-[130%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-200/25 blur-[130px] dark:bg-blue-400/10"
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

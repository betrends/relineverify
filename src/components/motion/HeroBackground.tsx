"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-violet-200/40 blur-[120px] dark:bg-violet-500/10"
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] top-10 h-[380px] w-[380px] rounded-full bg-blue-200/30 blur-[120px] dark:bg-blue-500/10"
        animate={{ x: [0, -30, 20, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-1/2 h-[300px] w-[300px] rounded-full bg-violet-100/40 blur-[110px] dark:bg-violet-500/5"
        animate={{ x: [0, 20, -30, 0], y: [0, -30, 10, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

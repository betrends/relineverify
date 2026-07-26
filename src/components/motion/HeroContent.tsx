"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.p
        variants={item}
        className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-violet-600"
      >
        SMS verification, resold right
      </motion.p>
      <motion.h1
        variants={item}
        className="font-display text-5xl font-700 leading-[1.05] tracking-tight text-slate-900 sm:text-6xl"
      >
        A number lands.
        <br />
        A code arrives.
        <br />
        <span className="text-violet-600">You're verified.</span>
      </motion.h1>
      <motion.p variants={item} className="mt-6 max-w-md text-lg text-slate-500">
        Rent virtual phone numbers for WhatsApp, Telegram, and hundreds of
        other services. Pay in Naira. No SIM card required.
      </motion.p>
      <motion.div variants={item} className="mt-8 flex items-center gap-4">
        <motion.span
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <Link
            href="/signup"
            className="inline-block rounded-full bg-violet-500 px-6 py-3 font-medium text-white shadow-[0_0_0_0_rgba(124,92,252,0.5)] transition-all hover:bg-violet-600 hover:shadow-[0_0_24px_4px_rgba(124,92,252,0.35)] focus-ring"
          >
            Create free account
          </Link>
        </motion.span>
        <Link
          href="/login"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          Already have an account →
        </Link>
      </motion.div>
    </motion.div>
  );
}

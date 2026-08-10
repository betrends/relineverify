"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import LiveCounterBadge from "./LiveCounterBadge";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroContent() {
  const t = useTranslations("hero");

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <LiveCounterBadge />
      <motion.p
        variants={item}
        className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-violet-600 dark:text-violet-300"
      >
        {t("eyebrow")}
      </motion.p>
      <motion.h1
        variants={item}
        className="font-display text-5xl font-700 leading-[1.05] tracking-tight text-slate-900 dark:text-paper-100 sm:text-6xl"
      >
        {t("headingLine1")}
        <br />
        {t("headingLine2")}
        <br />
        <span className="text-violet-600 dark:text-violet-300">{t("headingLine3")}</span>
      </motion.h1>
      <motion.p variants={item} className="mt-6 max-w-md text-lg text-slate-500 dark:text-slate-400">
        {t("subtext")}
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
            {t("createAccount")}
          </Link>
        </motion.span>
        <Link
          href="/login"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-paper-100"
        >
          {t("alreadyHaveAccount")}
        </Link>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTranslations } from "next-intl";
import ThemeToggleButton from "./ThemeToggleButton";
import LanguageSwitcher from "./LanguageSwitcher";

const LINK_KEYS = [
  { href: "/#how", key: "howItWorks" },
  { href: "/countries", key: "countries" },
  { href: "/services", key: "services" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
  { href: "/login", key: "signIn" },
] as const;

export default function SiteNav() {
  const t = useTranslations("nav");
  const [hovered, setHovered] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (mobileOpen) return;
    const goingDown = y > lastY.current;
    setHidden(goingDown && y > 96);
    lastY.current = y;
  });

  useEffect(() => {
    if (mobileOpen) setHidden(false);
  }, [mobileOpen]);

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/80"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-700 tracking-tight text-slate-900 dark:text-paper-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-white">
            <BoltIcon />
          </span>
          Reline
        </Link>

        <nav
          className="hidden items-center gap-0.5 text-sm text-slate-600 dark:text-slate-400 md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {LINK_KEYS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHovered(i)}
              className="relative rounded-full px-3 py-2 transition-colors hover:text-slate-900 dark:hover:text-paper-100"
            >
              {hovered === i && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-slate-100 dark:bg-ink-800"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{t(link.key)}</span>
            </Link>
          ))}
          <LanguageSwitcher className="ml-2" />
          <ThemeToggleButton className="h-8 w-8" />
          <Link
            href="/signup"
            className="ml-2 rounded-full bg-violet-500 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-600 focus-ring"
          >
            {t("getStarted")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <ThemeToggleButton className="h-9 w-9" />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="relative flex h-9 w-9 items-center justify-center"
          >
            <motion.span
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 0 : -5 }}
              transition={{ duration: 0.2 }}
              className="absolute h-[1.5px] w-5 bg-slate-900 dark:bg-paper-100"
            />
            <motion.span
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              transition={{ duration: 0.15 }}
              className="absolute h-[1.5px] w-5 bg-slate-900 dark:bg-paper-100"
            />
            <motion.span
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? 0 : 5 }}
              transition={{ duration: 0.2 }}
              className="absolute h-[1.5px] w-5 bg-slate-900 dark:bg-paper-100"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-100 dark:border-ink-800 md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
              {LINK_KEYS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-ink-800 dark:hover:text-paper-100"
                >
                  {t(link.key)}
                </Link>
              ))}
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-violet-500 px-4 py-2.5 text-center font-medium text-white transition-colors hover:bg-violet-600"
              >
                {t("getStarted")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M11 2 4 12h5l-1 6 7-10h-5l1-6Z" fill="currentColor" />
    </svg>
  );
}

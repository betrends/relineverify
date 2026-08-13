"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales, LOCALE_LABELS, type Locale } from "@/i18n/locales";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("language");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  async function select(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    setPending(true);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("label")}
        disabled={pending}
        className="flex h-9 items-center gap-1.5 rounded-full border border-slate-100 px-3 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60 dark:border-ink-800 dark:text-slate-400 dark:hover:bg-ink-800"
      >
        <span aria-hidden>{LOCALE_LABELS[locale].flag}</span>
        <span className="hidden sm:inline">{LOCALE_LABELS[locale].label}</span>
        <ChevronIcon className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-violet-100/60 bg-white/85 py-1 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/70">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => select(code)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-ink-800 ${
                code === locale
                  ? "font-medium text-violet-600 dark:text-violet-300"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <span aria-hidden>{LOCALE_LABELS[code].flag}</span>
              {LOCALE_LABELS[code].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

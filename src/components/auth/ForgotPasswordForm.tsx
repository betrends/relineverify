"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import MotionButton from "../motion/MotionButton";
import AnimatedError from "../motion/AnimatedError";
import ThemeToggleButton from "../ThemeToggleButton";

export default function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const tc = useTranslations("auth.common");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setError(json?.error || tc("errorGeneric"));
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white px-6 py-10 dark:bg-ink-950 lg:px-16 lg:py-12">
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-gradient-to-br from-violet-200/40 to-blue-200/30 blur-[100px] dark:from-violet-500/10 dark:to-blue-500/10" />
      <div className="relative flex items-center justify-end gap-4 text-sm text-slate-500 dark:text-slate-400">
        <ThemeToggleButton />
        {t("rememberedIt")}{" "}
        <Link href="/login" className="ml-1 font-medium text-violet-600 hover:underline dark:text-violet-300">
          {t("logIn")}
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
        {sent ? (
          <>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckIcon />
            </span>
            <h1 className="mt-4 font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
              {t("checkEmailTitle")}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {t.rich("checkEmailBody", {
                email,
                bold: (chunks) => (
                  <span className="font-medium text-slate-700 dark:text-slate-300">{chunks}</span>
                ),
              })}
            </p>
            <Link
              href="/login"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 py-3.5 font-medium text-white transition-opacity hover:opacity-90 focus-ring"
            >
              {t("backToLogin")}
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("subtitle")}</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <Field label={tc("emailAddress")}>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-3 focus-within:border-violet-500 dark:border-ink-700">
                  <MailIcon />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tc("enterEmail")}
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-paper-100 dark:placeholder:text-slate-500"
                  />
                </div>
              </Field>

              <AnimatedError message={error} />

              <MotionButton
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 py-3.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 focus-ring"
              >
                {loading ? t("sending") : t("sendResetLink")}
                {!loading && <ArrowRightIcon />}
              </MotionButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0 text-slate-400">
      <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10.5 8 14l8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

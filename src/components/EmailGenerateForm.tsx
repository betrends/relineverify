"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import MotionButton from "./motion/MotionButton";
import AnimatedError from "./motion/AnimatedError";
import HoverLift from "./motion/HoverLift";
import { refreshWallet, prefillTopupAmount } from "@/lib/walletEvents";
import type { GeneratedEmail } from "./EmailCard";

const EMAIL_COST = 1000;

export default function EmailGenerateForm({ onGenerated }: { onGenerated: (email: GeneratedEmail) => void }) {
  const t = useTranslations("dashboard.emailGenerate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/email-otp", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        if (typeof json.needed === "number") {
          prefillTopupAmount(json.needed);
          document.getElementById("topup")?.scrollIntoView({ behavior: "smooth", block: "start" });
          setError(t("insufficientFunds", { amount: json.needed.toLocaleString() }));
        } else {
          setError(json.error || t("errorGeneric"));
        }
        return;
      }
      onGenerated(json.email);
      refreshWallet();
    } finally {
      setLoading(false);
    }
  }

  return (
    <HoverLift
      id="generate-email"
      className="rounded-2xl border border-violet-100/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/50"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
          <MailIcon />
        </span>
        <div>
          <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">{t("title")}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("subtitle")}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {t("description", { cost: EMAIL_COST.toLocaleString() })}
      </p>

      <AnimatedError message={error} className="mt-3" />

      <MotionButton
        onClick={generate}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-ring"
      >
        {loading ? t("generating") : t("generate", { cost: EMAIL_COST.toLocaleString() })}
        {!loading && <ArrowRightIcon />}
      </MotionButton>
    </HoverLift>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
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

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "../motion/Reveal";
import HoverLift from "../motion/HoverLift";
import MotionButton from "../motion/MotionButton";
import EmptyState from "../EmptyState";

type Earning = {
  id: string;
  referredName: string;
  topupAmount: number;
  rewardAmount: number;
  createdAt: string;
};

type ReferralData = {
  code: string;
  percent: number;
  totalReferred: number;
  totalEarned: number;
  earnings: Earning[];
};

export default function ReferralsClient() {
  const t = useTranslations("dashboard.referrals");
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch("/api/referrals", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => setData(null));
  }, []);

  function copy(text: string, what: "code" | "link") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-ink-800" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-ink-800" />
        </div>
        <div className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-ink-800" />
      </div>
    );
  }

  const link = `${origin}/signup?ref=${data.code}`;

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          <HoverLift className="rounded-2xl border border-violet-100/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/50">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("friendsReferred")}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-paper-100">{data.totalReferred}</p>
          </HoverLift>
          <HoverLift className="rounded-2xl border border-violet-100/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/50">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("totalEarned")}</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-mint-400">
              ₦{data.totalEarned.toLocaleString()}
            </p>
          </HoverLift>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="rounded-2xl border border-violet-100/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/50">
          <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">
            {t("earnForLife", { percent: data.percent })}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("shareDescription", { percent: data.percent })}
          </p>

          <div className="mt-5 space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                {t("yourCode")}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:border-ink-700 dark:bg-ink-950 dark:text-paper-100">
                  {data.code}
                </div>
                <MotionButton
                  onClick={() => copy(data.code, "code")}
                  className="shrink-0 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors focus-ring dark:border-ink-700 dark:text-slate-300 dark:hover:bg-ink-800"
                >
                  {copied === "code" ? t("copied") : t("copy")}
                </MotionButton>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                {t("yourLink")}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 truncate rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:border-ink-700 dark:bg-ink-950 dark:text-paper-100">
                  {link}
                </div>
                <MotionButton
                  onClick={() => copy(link, "link")}
                  className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-ring"
                >
                  {copied === "link" ? t("copied") : t("copyLink")}
                </MotionButton>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div>
          <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">{t("earningsHistory")}</h2>
          {data.earnings.length === 0 ? (
            <EmptyState
              icon={<GiftIcon />}
              title={t("noEarningsTitle")}
              description={t("noEarningsDesc")}
            />
          ) : (
            <HoverLift className="mt-4 overflow-hidden rounded-2xl border border-violet-100/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/50">
              <div className="divide-y divide-slate-100 dark:divide-ink-800">
                {data.earnings.map((e) => (
                  <div key={e.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-paper-100">
                        {t("toppedUp", { name: e.referredName, amount: e.topupAmount.toLocaleString() })}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-slate-400">
                        {new Date(e.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-semibold text-emerald-600 dark:text-mint-400">
                      +₦{e.rewardAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </HoverLift>
          )}
        </div>
      </Reveal>
    </div>
  );
}

function GiftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="8" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8h14M10 8v9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 8c-2.5 0-3.5-1.2-3.5-2.5S7.2 3 8.3 3c1.3 0 1.7 1.5 1.7 2.5M10 8c2.5 0 3.5-1.2 3.5-2.5S12.8 3 11.7 3c-1.3 0-1.7 1.5-1.7 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

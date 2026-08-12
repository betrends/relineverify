"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import HoverLift from "../motion/HoverLift";
import EmptyState from "../EmptyState";

type Transaction = {
  id: string;
  type: "topup" | "purchase" | "refund" | "email" | "referral";
  amount: number;
  reference: string;
  status: "pending" | "successful" | "failed";
  createdAt: string;
};

const TYPE_META = {
  topup: { key: "typeTopup", sign: "+", color: "text-emerald-600 dark:text-emerald-300" },
  refund: { key: "typeRefund", sign: "+", color: "text-emerald-600 dark:text-emerald-300" },
  referral: { key: "typeReferral", sign: "+", color: "text-emerald-600 dark:text-emerald-300" },
  purchase: { key: "typePurchase", sign: "−", color: "text-slate-900 dark:text-paper-100" },
  email: { key: "typeEmail", sign: "−", color: "text-slate-900 dark:text-paper-100" },
} as const;

const STATUS_KEY = {
  successful: "statusSuccessful",
  pending: "statusPending",
  failed: "statusFailed",
} as const;

const STATUS_BADGE = {
  successful: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  failed: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
} as const;

export default function TransactionHistory() {
  const t = useTranslations("dashboard.transactions");
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  useEffect(() => {
    fetch("/api/wallet/transactions", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { transactions: [] }))
      .then((d) => setTransactions(d.transactions || []));
  }, []);

  if (transactions === null) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-ink-800" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptIcon />}
        title={t("noTransactionsTitle")}
        description={t("noTransactionsDesc")}
      />
    );
  }

  return (
    <HoverLift className="overflow-hidden rounded-2xl border border-violet-100/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/50">
      <div className="divide-y divide-slate-100 dark:divide-ink-800">
        {transactions.map((tx) => {
          const meta = TYPE_META[tx.type];
          return (
            <div key={tx.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    meta.sign === "−"
                      ? "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-400"
                      : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                  }`}
                >
                  {meta.sign === "−" ? <ArrowDownIcon /> : <ArrowUpIcon />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-paper-100">{t(meta.key)}</p>
                  <p className="truncate font-mono text-xs text-slate-400">
                    {new Date(tx.createdAt).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className={`font-mono text-sm font-semibold ${meta.color}`}>
                  {meta.sign}₦{tx.amount.toLocaleString()}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[tx.status]}`}>
                  {t(STATUS_KEY[tx.status])}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </HoverLift>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 15V5M5 9.5 10 5l5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 5v10M5 10.5 10 15l5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 3h10v14l-2-1.3L11.3 17 9.7 15.7 8 17l-1.7-1.3L4.5 17V3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7 7.5h6M7 10.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

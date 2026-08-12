"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useWalletBalance } from "@/lib/useWalletBalance";
import Reveal from "./motion/Reveal";
import HoverLift from "./motion/HoverLift";
import AnimatedNumber from "./motion/AnimatedNumber";
import type { Order } from "./OrderCard";
import type { GeneratedEmail } from "./EmailCard";

const ACCENT = {
  violet: { iconBg: "bg-violet-50 dark:bg-violet-500/10", icon: "text-violet-600 dark:text-violet-300", chip: "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300" },
  blue: { iconBg: "bg-blue-50 dark:bg-blue-500/10", icon: "text-blue-600 dark:text-blue-300", chip: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300" },
  emerald: { iconBg: "bg-emerald-50 dark:bg-emerald-500/10", icon: "text-emerald-600 dark:text-emerald-300", chip: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300" },
} as const;

export default function StatsStrip({ orders, emails }: { orders: Order[]; emails: GeneratedEmail[] }) {
  const t = useTranslations("dashboard.stats");
  const { balance } = useWalletBalance();

  // "Pending" covers both a fresh email waiting on its first code and one
  // mid-regenerate waiting on a replacement — both are genuinely in flight,
  // same as a pending SMS order.
  const activeCount = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status === "pending").length;
    const activeEmails = emails.filter((e) => e.status === "pending").length;
    return activeOrders + activeEmails;
  }, [orders, emails]);
  // Only charges that were actually kept count as spend. Orders: "received"
  // only — cancelled/expired orders are refunded. Emails never refund once
  // charged (received, expired, or cancelled all keep the charge), so any
  // non-pending email counts.
  const lifetimeSpend = useMemo(() => {
    const orderSpend = orders.filter((o) => o.status === "received").reduce((sum, o) => sum + o.costCharged, 0);
    const emailSpend = emails
      .filter((e) => e.status !== "pending")
      .reduce((sum, e) => sum + e.costCharged, 0);
    return orderSpend + emailSpend;
  }, [orders, emails]);

  const stats: {
    key: "walletBalance" | "activeOrders" | "totalSpent";
    value: number;
    prefix: string;
    accent: keyof typeof ACCENT;
    icon: React.ReactNode;
    live?: boolean;
    href?: string;
  }[] = [
    {
      key: "walletBalance",
      value: balance ?? 0,
      prefix: "₦",
      accent: "violet",
      icon: <WalletIcon />,
      href: "/dashboard/transactions",
    },
    {
      key: "activeOrders",
      value: activeCount,
      prefix: "",
      accent: "blue",
      icon: <OrdersIcon />,
      live: activeCount > 0,
    },
    {
      key: "totalSpent",
      value: lifetimeSpend,
      prefix: "₦",
      accent: "emerald",
      icon: <SparkIcon />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s, i) => {
        const card = (
          <HoverLift
            className={`flex items-center justify-between rounded-2xl border border-violet-100/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/50 ${
              s.href ? "cursor-pointer" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ACCENT[s.accent].iconBg} ${ACCENT[s.accent].icon}`}>
                {s.live && (
                  <span className="absolute inset-0 animate-ping rounded-xl bg-amber-400/30" />
                )}
                {s.icon}
              </span>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t(s.key)}</p>
                {balance === null && s.key === "walletBalance" ? (
                  <p className="text-2xl font-bold text-slate-900 dark:text-paper-100">…</p>
                ) : (
                  <AnimatedNumber
                    value={s.value}
                    prefix={s.prefix}
                    className="text-2xl font-bold text-slate-900 dark:text-paper-100"
                  />
                )}
              </div>
            </div>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ACCENT[s.accent].chip}`}
            >
              <ChevronRightIcon />
            </span>
          </HoverLift>
        );

        return (
          <Reveal key={s.key} delay={i * 0.05}>
            {s.href ? (
              <Link href={s.href} className="block focus-ring rounded-2xl">
                {card}
              </Link>
            ) : (
              card
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 6.5C3 5.12 4.12 4 5.5 4h9A2.5 2.5 0 0 1 17 6.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 13.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M13 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="M3 8h11.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 13.5 8 11l2-5 2 5 5 2.5-5 2.5-2 5-2-5-5-2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M7.5 5 12.5 10 7.5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

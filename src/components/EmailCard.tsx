"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import OtpReadout from "./OtpReadout";
import MotionButton from "./motion/MotionButton";
import AnimatedError from "./motion/AnimatedError";
import { extractCode } from "@/lib/extractCode";
import { useCodeExpiry, formatRemaining } from "@/lib/useCodeExpiry";
import { refreshWallet, prefillTopupAmount } from "@/lib/walletEvents";
import { playCodeReceivedSound } from "@/lib/notificationSound";

const REGENERATE_COST = 1000;

export type GeneratedEmail = {
  id: string;
  address: string;
  costCharged: number;
  emailText: string | null;
  status: "pending" | "received" | "expired" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

const STATUS_KEY: Record<GeneratedEmail["status"], "statusWaiting" | "statusReceived" | "statusExpired" | "statusCancelled"> = {
  pending: "statusWaiting",
  received: "statusReceived",
  expired: "statusExpired",
  cancelled: "statusCancelled",
};

const STATUS_BADGE: Record<GeneratedEmail["status"], string> = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
  received: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-mint-400",
  expired: "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-500",
  cancelled: "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-500",
};

const EmailCard = forwardRef<HTMLDivElement, {
  email: GeneratedEmail;
  onChange?: (email: GeneratedEmail) => void;
}>(function EmailCard({ email: initial, onChange }, ref) {
  const t = useTranslations("dashboard.emailCard");
  const [email, setEmail] = useState(initial);
  const [copied, setCopied] = useState<"address" | "code" | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [regenError, setRegenError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { expired: codeExpired, remainingMs } = useCodeExpiry(
    email.status === "received" ? email.updatedAt : undefined
  );

  useEffect(() => setEmail(initial), [initial]);

  useEffect(() => {
    if (email.status !== "pending") {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    async function poll() {
      const res = await fetch(`/api/email-otp/${email.id}/status`, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (json.email.status === "received" && json.email.status !== email.status) {
        playCodeReceivedSound();
      }
      setEmail(json.email);
      onChange?.(json.email);
    }
    poll();
    pollRef.current = setInterval(poll, 8000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email.id, email.status]);

  function copy(text: string, what: "address" | "code") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  async function regenerate() {
    setRegenError(null);
    setRegenerating(true);
    try {
      const res = await fetch(`/api/email-otp/${email.id}/regenerate`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        if (typeof json.needed === "number") {
          prefillTopupAmount(json.needed);
          document.getElementById("topup")?.scrollIntoView({ behavior: "smooth", block: "start" });
          setRegenError(t("insufficientFunds", { amount: json.needed.toLocaleString() }));
        } else {
          setRegenError(json.error || t("errorGeneric"));
        }
        return;
      }
      setEmail(json.email);
      onChange?.(json.email);
      refreshWallet();
    } finally {
      setRegenerating(false);
    }
  }

  async function cancel() {
    setCancelling(true);
    try {
      const res = await fetch(`/api/email-otp/${email.id}/cancel`, { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setEmail(json.email);
        onChange?.(json.email);
      }
    } finally {
      setCancelling(false);
    }
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl border border-violet-100/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
            <MailIcon />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-semibold text-slate-900 dark:text-paper-100">
              {email.address}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-500">{t("oneTimeInbox")}</p>
          </div>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[email.status]}`}
        >
          {email.status === "pending" && (
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulseDot" />
          )}
          {t(STATUS_KEY[email.status])}
        </span>
      </div>

      <motion.div
        key={email.status}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center dark:bg-ink-950"
      >
        {email.status === "pending" && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl border border-amber-400/50"
            animate={{ opacity: [0.25, 0.8, 0.25] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {email.status === "received" ? (
          codeExpired ? (
            <div>
              <p className="text-sm text-slate-500">{t("codeExpired")}</p>
              <AnimatedError message={regenError} className="mt-2" />
              <MotionButton
                onClick={regenerate}
                disabled={regenerating}
                className="mt-3 w-full rounded-full bg-gradient-to-r from-violet-500 to-violet-600 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-ring"
              >
                {regenerating ? t("requesting") : t("getNewCode", { cost: REGENERATE_COST.toLocaleString() })}
              </MotionButton>
            </div>
          ) : (
            (() => {
              const code = extractCode(email.emailText);
              return (
                <>
                  <OtpReadout
                    resolved={code || email.emailText || ""}
                    length={6}
                    className="text-2xl text-emerald-600 dark:text-mint-400"
                  />
                  {/* Only show the raw message when it's distinct from what's already
                      shown above — extractCode() falls back to the full text when it
                      can't find a code, so re-printing it here would just duplicate it. */}
                  {code && <p className="mt-2 truncate text-xs text-slate-500">{email.emailText}</p>}
                  <p className="mt-1 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                    {t("expiresIn", { time: formatRemaining(remainingMs) })}
                  </p>
                </>
              );
            })()
          )
        ) : email.status === "pending" ? (
          <OtpReadout length={6} className="text-2xl text-slate-400" />
        ) : email.status === "cancelled" ? (
          <p className="text-sm text-slate-500">{t("cancelledNoRefund")}</p>
        ) : (
          <p className="text-sm text-slate-500">{t("noEmailNoRefund")}</p>
        )}
      </motion.div>

      <div className="mt-4 flex gap-2">
        <MotionButton
          onClick={() => copy(email.address, "address")}
          className="flex-1 rounded-full border border-slate-200 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors focus-ring dark:border-ink-700 dark:text-slate-400 dark:hover:bg-ink-800 dark:hover:text-paper-100"
        >
          {copied === "address" ? t("copied") : t("copyAddress")}
        </MotionButton>
        {email.status === "received" && !codeExpired && (
          <MotionButton
            onClick={() => copy(extractCode(email.emailText) || email.emailText || "", "code")}
            className="flex-1 rounded-full border border-emerald-200 bg-emerald-50 py-2 text-xs text-emerald-600 hover:bg-emerald-100 transition-colors focus-ring dark:border-mint-500/30 dark:bg-mint-500/10 dark:text-mint-400 dark:hover:bg-mint-500/20"
          >
            {copied === "code" ? t("copied") : t("copyCode")}
          </MotionButton>
        )}
        {email.status === "pending" && (
          <MotionButton
            onClick={cancel}
            disabled={cancelling}
            title={t("cancelHint")}
            className="flex-1 rounded-full border border-slate-200 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 transition-colors focus-ring dark:border-ink-700 dark:text-slate-400 dark:hover:bg-ink-800 dark:hover:text-paper-100"
          >
            {cancelling ? t("cancelling") : t("cancel")}
          </MotionButton>
        )}
      </div>
    </motion.div>
  );
});

export default EmailCard;

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

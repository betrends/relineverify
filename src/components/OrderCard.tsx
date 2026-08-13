"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import OtpReadout from "./OtpReadout";
import ServiceIcon from "./ServiceIcon";
import MotionButton from "./motion/MotionButton";
import { refreshWallet } from "@/lib/walletEvents";
import { extractCode } from "@/lib/extractCode";
import { useCodeExpiry, formatRemaining } from "@/lib/useCodeExpiry";
import { playCodeReceivedSound } from "@/lib/notificationSound";

export type Order = {
  id: string;
  externalOrderId: string;
  server: string;
  country: string;
  countryName: string;
  service: string;
  serviceName: string;
  number: string;
  costCharged: number;
  smsText: string | null;
  status: "pending" | "received" | "cancelled" | "expired";
  createdAt: string;
  updatedAt: string;
};

const STATUS_KEY: Record<Order["status"], "statusPending" | "statusReceived" | "statusCancelled" | "statusExpired"> = {
  pending: "statusPending",
  received: "statusReceived",
  cancelled: "statusCancelled",
  expired: "statusExpired",
};

const STATUS_BADGE: Record<Order["status"], string> = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
  received: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-mint-400",
  cancelled: "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-500",
  expired: "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-500",
};

const OrderCard = forwardRef<HTMLDivElement, {
  order: Order;
  onChange?: (order: Order) => void;
}>(function OrderCard({ order: initial, onChange }, ref) {
  const t = useTranslations("dashboard.orderCard");
  const [order, setOrder] = useState(initial);
  const [canCancel, setCanCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState<"number" | "code" | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { expired: codeExpired, remainingMs } = useCodeExpiry(
    order.status === "received" ? order.updatedAt : undefined
  );

  useEffect(() => setOrder(initial), [initial]);

  // 2-minute minimum-wait-before-cancel countdown
  useEffect(() => {
    if (order.status !== "pending") return;
    const createdAt = new Date(order.createdAt).getTime();
    const tick = () => setCanCancel(Date.now() - createdAt >= 2 * 60 * 1000);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [order.status, order.createdAt]);

  // Poll for SMS while pending
  useEffect(() => {
    if (order.status !== "pending") {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    async function poll() {
      const res = await fetch(`/api/orders/${order.id}/status`, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (json.order.status === "received" && json.order.status !== order.status) {
        playCodeReceivedSound();
      }
      setOrder(json.order);
      onChange?.(json.order);
    }
    poll();
    pollRef.current = setInterval(poll, 4000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id, order.status]);

  async function cancel() {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setOrder(json.order);
        onChange?.(json.order);
        refreshWallet();
      }
    } finally {
      setCancelling(false);
    }
  }

  function copy(text: string, what: "number" | "code") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    });
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
          <ServiceIcon name={order.serviceName} />
          <div className="min-w-0">
            <p className="truncate font-mono font-semibold text-slate-900 dark:text-paper-100">{order.number}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-500">
              {order.serviceName} · {order.countryName}
            </p>
          </div>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[order.status]}`}
        >
          {order.status === "pending" && (
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulseDot" />
          )}
          {t(STATUS_KEY[order.status])}
        </span>
      </div>

      <motion.div
        key={order.status}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center dark:bg-ink-950"
      >
        {order.status === "pending" && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl border border-amber-400/50"
            animate={{ opacity: [0.25, 0.8, 0.25] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {order.status === "received" ? (
          codeExpired ? (
            <p className="text-sm text-slate-500">{t("codeExpired")}</p>
          ) : (
            (() => {
              const code = extractCode(order.smsText);
              return (
                <>
                  <OtpReadout
                    resolved={code || order.smsText || ""}
                    length={6}
                    className="text-2xl text-emerald-600 dark:text-mint-400"
                  />
                  {/* Only show the raw message when it's distinct from what's already
                      shown above — extractCode() falls back to the full text when it
                      can't find a code, so re-printing it here would just duplicate it. */}
                  {code && <p className="mt-2 text-xs text-slate-500">{order.smsText}</p>}
                  <p className="mt-1 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                    {t("expiresIn", { time: formatRemaining(remainingMs) })}
                  </p>
                </>
              );
            })()
          )
        ) : order.status === "pending" ? (
          <OtpReadout length={6} className="text-2xl text-slate-400" />
        ) : (
          <p className="text-sm text-slate-500">
            {t("noCodeRefunded", { amount: order.costCharged.toLocaleString() })}
          </p>
        )}
      </motion.div>

      <div className="mt-4 flex gap-2">
        <MotionButton
          onClick={() => copy(order.number, "number")}
          className="flex-1 rounded-full border border-slate-200 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors focus-ring dark:border-ink-700 dark:text-slate-400 dark:hover:bg-ink-800 dark:hover:text-paper-100"
        >
          {copied === "number" ? t("copied") : t("copyNumber")}
        </MotionButton>
        {order.status === "received" && !codeExpired && (
          <MotionButton
            onClick={() => copy(extractCode(order.smsText) || order.smsText || "", "code")}
            className="flex-1 rounded-full border border-emerald-200 bg-emerald-50 py-2 text-xs text-emerald-600 hover:bg-emerald-100 transition-colors focus-ring dark:border-mint-500/30 dark:bg-mint-500/10 dark:text-mint-400 dark:hover:bg-mint-500/20"
          >
            {copied === "code" ? t("copied") : t("copyCode")}
          </MotionButton>
        )}
        {order.status === "pending" && (
          <MotionButton
            onClick={cancel}
            disabled={!canCancel || cancelling}
            title={!canCancel ? t("cancelHint") : undefined}
            className="flex-1 rounded-full border border-slate-200 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 transition-colors focus-ring dark:border-ink-700 dark:text-slate-400 dark:hover:bg-ink-800 dark:hover:text-paper-100"
          >
            {cancelling ? t("cancelling") : t("cancel")}
          </MotionButton>
        )}
      </div>
    </motion.div>
  );
});

export default OrderCard;

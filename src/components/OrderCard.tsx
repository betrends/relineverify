"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import OtpReadout from "./OtpReadout";
import ServiceIcon from "./ServiceIcon";
import MotionButton from "./motion/MotionButton";
import { refreshWallet } from "@/lib/walletEvents";

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
};

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pending",
  received: "Received",
  cancelled: "Cancelled",
  expired: "Expired",
};

const STATUS_BADGE: Record<Order["status"], string> = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
  received: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-mint-400",
  cancelled: "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-500",
  expired: "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-500",
};

export default function OrderCard({
  order: initial,
  onChange,
}: {
  order: Order;
  onChange?: (order: Order) => void;
}) {
  const [order, setOrder] = useState(initial);
  const [canCancel, setCanCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState<"number" | "code" | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      layout
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-ink-700 dark:bg-ink-900"
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
          {STATUS_LABEL[order.status]}
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
          <>
            <OtpReadout
              resolved={extractCode(order.smsText) || order.smsText || ""}
              length={6}
              className="text-2xl text-emerald-600 dark:text-mint-400"
            />
            <p className="mt-2 text-xs text-slate-500">{order.smsText}</p>
          </>
        ) : order.status === "pending" ? (
          <OtpReadout length={6} className="text-2xl text-slate-400" />
        ) : (
          <p className="text-sm text-slate-500">No code — {order.costCharged.toLocaleString()} NGN refunded</p>
        )}
      </motion.div>

      <div className="mt-4 flex gap-2">
        <MotionButton
          onClick={() => copy(order.number, "number")}
          className="flex-1 rounded-full border border-slate-200 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors focus-ring dark:border-ink-700 dark:text-slate-400 dark:hover:bg-ink-800 dark:hover:text-paper-100"
        >
          {copied === "number" ? "Copied!" : "Copy number"}
        </MotionButton>
        {order.status === "received" && (
          <MotionButton
            onClick={() => copy(extractCode(order.smsText) || order.smsText || "", "code")}
            className="flex-1 rounded-full border border-emerald-200 bg-emerald-50 py-2 text-xs text-emerald-600 hover:bg-emerald-100 transition-colors focus-ring dark:border-mint-500/30 dark:bg-mint-500/10 dark:text-mint-400 dark:hover:bg-mint-500/20"
          >
            {copied === "code" ? "Copied!" : "Copy code"}
          </MotionButton>
        )}
        {order.status === "pending" && (
          <MotionButton
            onClick={cancel}
            disabled={!canCancel || cancelling}
            title={!canCancel ? "Available 2 minutes after purchase" : undefined}
            className="flex-1 rounded-full border border-slate-200 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 transition-colors focus-ring dark:border-ink-700 dark:text-slate-400 dark:hover:bg-ink-800 dark:hover:text-paper-100"
          >
            {cancelling ? "Cancelling…" : "Cancel"}
          </MotionButton>
        )}
      </div>
    </motion.div>
  );
}

function extractCode(sms: string | null): string | null {
  if (!sms) return null;
  const match = sms.match(/\d[\d\s-]{2,}\d/);
  return match ? match[0].replace(/[\s-]/g, "") : null;
}

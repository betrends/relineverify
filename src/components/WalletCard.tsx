"use client";

import { useState } from "react";
import MotionButton from "./motion/MotionButton";
import AnimatedError from "./motion/AnimatedError";
import HoverLift from "./motion/HoverLift";

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000];

export default function WalletCard() {
  const [amount, setAmount] = useState(2500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function topUp() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not start payment");
        return;
      }
      window.location.href = json.link;
    } finally {
      setLoading(false);
    }
  }

  return (
    <HoverLift id="topup" className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
      <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">Top Up Wallet</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fund your wallet in seconds.</p>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <MotionButton
            key={preset}
            onClick={() => setAmount(preset)}
            className={`rounded-xl border py-2 font-mono text-sm transition-colors focus-ring ${
              amount === preset
                ? "border-violet-500 bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
                : "border-slate-200 text-slate-500 hover:border-slate-300 dark:border-ink-700 dark:text-slate-400 dark:hover:border-slate-500"
            }`}
          >
            ₦{preset.toLocaleString()}
          </MotionButton>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-violet-500 dark:border-ink-700 dark:bg-ink-950">
        <span className="text-slate-400">₦</span>
        <input
          type="number"
          min={100}
          step={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-transparent font-mono text-lg font-semibold text-slate-900 focus:outline-none dark:text-paper-100"
        />
      </div>

      <AnimatedError message={error} className="mt-3" />

      <MotionButton
        onClick={topUp}
        disabled={loading || amount < 100}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-ring"
      >
        {loading ? "Redirecting…" : "Top Up Wallet"}
        {!loading && <ArrowRightIcon />}
      </MotionButton>
    </HoverLift>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

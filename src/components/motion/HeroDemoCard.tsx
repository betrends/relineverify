"use client";

import { motion } from "framer-motion";
import OtpReadout from "@/components/OtpReadout";

export default function HeroDemoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_0_60px_-15px_rgba(124,92,252,0.25)]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-sm text-slate-500">Incoming — WhatsApp</span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulseDot" />
            live
          </span>
        </div>
        <div className="py-8 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            Your verification code
          </p>
          <OtpReadout resolved="482 913" length={7} className="text-4xl text-slate-900" />
        </div>
        <div className="rounded-lg bg-slate-50 px-4 py-3 font-mono text-xs text-slate-500">
          +234 90• ••• 4471 · received in 4.2s
        </div>
      </motion.div>
    </motion.div>
  );
}

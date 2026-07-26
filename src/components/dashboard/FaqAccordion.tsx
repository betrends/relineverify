"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "How fast will I receive my verification code?",
    a: "Most codes land within 2–10 seconds of the number being assigned. If nothing arrives within the order's timeout window, it's automatically cancelled and refunded to your wallet — no code, no charge.",
  },
  {
    q: "What happens if I don't receive an SMS?",
    a: "You're never charged for a number that never receives a code. Once an order times out, its cost is refunded straight back to your wallet balance, visible immediately in Active Orders.",
  },
  {
    q: "Can I reuse the same number for another service?",
    a: "No — each number is single-use per order and is released back into the pool once your session ends, so it stays clean for the next service you verify.",
  },
  {
    q: "How do I top up my wallet?",
    a: "Open Top Up Wallet on your dashboard, pick or type an amount, and pay by card, bank transfer, or USSD through Korapay. Funds land in your wallet as soon as payment confirms.",
  },
  {
    q: "Is my personal data safe?",
    a: "Yes. We never share your information with third parties, and numbers are only used for the one-time verification you requested — nothing is linked back to your identity.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-100 dark:divide-ink-800">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left focus-ring"
            >
              <span className="text-sm font-medium text-slate-900 dark:text-paper-100">{faq.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-400"
              >
                <PlusIcon />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

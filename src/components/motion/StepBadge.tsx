"use client";

import { motion } from "framer-motion";

// The circular step number + the line connecting it to the next step,
// which draws itself in (left to right) as it scrolls into view — makes
// the 3-step flow read as a single connected path rather than 3 separate
// cards.
export default function StepBadge({ number, showLine }: { number: string; showLine: boolean }) {
  return (
    <div className="relative flex items-center">
      <motion.span
        whileHover={{ scale: 1.08, borderColor: "rgba(124,92,252,0.8)" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-white font-mono text-sm font-700 text-violet-600 dark:border-violet-500/30 dark:bg-ink-900 dark:text-violet-300"
      >
        {number}
      </motion.span>
      {showLine && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
          className="ml-2 hidden h-px flex-1 bg-gradient-to-r from-violet-300 to-transparent dark:from-violet-500/40 sm:block"
        />
      )}
    </div>
  );
}

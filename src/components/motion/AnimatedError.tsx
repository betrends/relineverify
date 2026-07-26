"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function AnimatedError({
  message,
  className = "",
}: {
  message: string | null;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`text-sm text-danger-400 ${className}`}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

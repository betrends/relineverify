"use client";

import { motion } from "framer-motion";

export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center dark:border-ink-700 dark:bg-ink-900/40">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-ink-800 dark:text-slate-500"
      >
        {icon}
      </motion.div>
      <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

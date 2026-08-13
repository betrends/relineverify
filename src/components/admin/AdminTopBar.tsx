"use client";

import { useMobileNav } from "../dashboard/MobileNavProvider";

export default function AdminTopBar() {
  const { toggle } = useMobileNav();

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-900 md:hidden">
      <button
        onClick={toggle}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-ink-800"
      >
        <MenuIcon />
      </button>
      <span className="font-display text-sm font-700 text-slate-900 dark:text-paper-100">Reline Admin</span>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

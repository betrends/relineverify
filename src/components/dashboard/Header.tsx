"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../ThemeProvider";
import { useSearch } from "./SearchProvider";

export default function Header({ email, name }: { email: string; name?: string | null }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { query, setQuery } = useSearch();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fallback = email.split("@")[0].replace(/[._-]/g, " ");
  const displayName = name || fallback.charAt(0).toUpperCase() + fallback.slice(1);
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex items-center gap-4 border-b border-slate-100 bg-white px-6 py-4 dark:border-ink-800 dark:bg-ink-950">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400 dark:border-ink-800 dark:bg-ink-900">
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search numbers, or orders…"
          className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-paper-100"
        />
        <kbd className="hidden shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] text-slate-400 sm:block dark:border-ink-700 dark:bg-ink-800">
          ⌘K
        </kbd>
      </div>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 dark:border-ink-800 dark:text-slate-400 dark:hover:bg-ink-900"
      >
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </button>

      <div ref={notifRef} className="relative shrink-0">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 dark:border-ink-800 dark:text-slate-400 dark:hover:bg-ink-900"
        >
          <BellIcon />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-medium text-white">
            3
          </span>
        </button>
        {notifOpen && (
          <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500 shadow-lg dark:border-ink-800 dark:bg-ink-900 dark:text-slate-400">
            No new notifications yet — order updates will show up here.
          </div>
        )}
      </div>

      <div ref={menuRef} className="relative shrink-0">
        <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-sm font-medium text-white">
            {initials}
          </span>
          <span className="hidden text-sm font-medium text-slate-700 sm:block dark:text-paper-100">
            {displayName}
          </span>
          <ChevronIcon className={`hidden text-slate-400 transition-transform sm:block ${menuOpen ? "rotate-180" : ""}`} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg dark:border-ink-800 dark:bg-ink-900">
            <p className="truncate border-b border-slate-100 px-4 py-2.5 text-xs text-slate-400 dark:border-ink-800">
              {email}
            </p>
            <button
              onClick={logout}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-ink-800"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m17 17-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 8a5 5 0 0 1 10 0c0 4 1.5 5 1.5 5h-13S5 12 5 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8.2 16a1.8 1.8 0 0 0 3.6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M17 11.5A7 7 0 1 1 8.5 3a5.5 5.5 0 0 0 8.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

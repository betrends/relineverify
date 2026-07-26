"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../ThemeProvider";

const NAV_ITEMS: {
  label: string;
  href?: string;
  icon: (props: { className?: string }) => React.ReactNode;
  soon?: boolean;
  activeOn?: string;
}[] = [
  { label: "Dashboard", href: "#top", icon: GridIcon, activeOn: "/dashboard" },
  { label: "Top Up Wallet", href: "#topup", icon: WalletIcon },
  { label: "Buy a Number", href: "#buy", icon: HashIcon },
  { label: "Active Orders", href: "#active-orders", icon: OrdersIcon },
  { label: "History", href: "#history", icon: HistoryIcon },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon, activeOn: "/dashboard/settings" },
  { label: "Support", href: "/dashboard/support", icon: SupportIcon, activeOn: "/dashboard/support" },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-100 bg-white px-4 py-6 dark:border-ink-800 dark:bg-ink-950">
      <Link href="/dashboard" className="flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white">
          <BoltIcon />
        </span>
        <span className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">Reline</span>
      </Link>

      <nav className="mt-8 flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          if (item.soon) {
            return (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-400 dark:text-slate-500"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-ink-800 dark:text-slate-500">
                  Soon
                </span>
              </div>
            );
          }
          const isActive = item.activeOn === pathname;
          const href = item.href?.startsWith("#") ? `/dashboard${item.href}` : item.href;
          return (
            <Link
              key={item.label}
              href={href!}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-ink-800 dark:hover:text-paper-100"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={toggleTheme}
        className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 text-sm text-slate-600 dark:border-ink-800 dark:text-slate-400"
      >
        <span className="flex items-center gap-2">
          {theme === "light" ? <SunIcon /> : <MoonIcon />}
          {theme === "light" ? "Light Mode" : "Dark Mode"}
        </span>
        <span
          className={`relative h-5 w-9 rounded-full transition-colors ${
            theme === "light" ? "bg-violet-500" : "bg-ink-700"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
              theme === "light" ? "translate-x-[18px]" : "translate-x-0.5"
            }`}
          />
        </span>
      </button>
    </aside>
  );
}

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M11 2 4 12h5l-1 6 7-10h-5l1-6Z" fill="currentColor" />
    </svg>
  );
}

function GridIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function WalletIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path
        d="M3 6.5C3 5.12 4.12 4 5.5 4h9A2.5 2.5 0 0 1 17 6.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 13.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M13 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="M3 8h11.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HashIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path
        d="M7.5 3 6 17M14 3l-1.5 14M4 8h13M3.3 12.5h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrdersIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HistoryIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.5v3.7l2.8 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 3v1.5M10 15.5V17M17 10h-1.5M4.5 10H3M14.8 5.2l-1 1M6.2 13.8l-1 1M14.8 14.8l-1-1M6.2 6.2l-1-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SupportIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path
        d="M4 11v-1a6 6 0 0 1 12 0v1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="2.5" y="11" width="4" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13.5" y="11" width="4" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
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
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="M17 11.5A7 7 0 1 1 8.5 3a5.5 5.5 0 0 0 8.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

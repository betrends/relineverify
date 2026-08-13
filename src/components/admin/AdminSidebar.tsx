"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobileNav } from "../dashboard/MobileNavProvider";
import ThemeToggleButton from "../ThemeToggleButton";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: GridIcon, exact: true },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/transactions", label: "Transactions", icon: ReceiptIcon },
  { href: "/admin/orders", label: "Numbers", icon: HashIcon },
  { href: "/admin/emails", label: "Emails", icon: MailIcon },
  { href: "/admin/broadcast", label: "Broadcast", icon: MegaphoneIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { open, close } = useMobileNav();

  return (
    <>
      {open && <div onClick={close} aria-hidden className="fixed inset-0 z-40 bg-black/40 md:hidden" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 transition-transform duration-200 ease-out dark:border-ink-800 dark:bg-ink-900 md:sticky md:top-0 md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/admin" className="flex items-center gap-2" onClick={close}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-white">
              <BoltIcon />
            </span>
            <span className="font-display text-base font-700 text-slate-900 dark:text-paper-100">
              Reline <span className="font-normal text-slate-400 dark:text-slate-500">Admin</span>
            </span>
          </Link>
          <button
            onClick={close}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-900 md:hidden dark:hover:bg-ink-800 dark:hover:text-paper-100"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
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

        <div className="space-y-1 border-t border-slate-100 pt-4 dark:border-ink-800">
          <Link
            href="/dashboard"
            onClick={close}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-ink-800 dark:hover:text-paper-100"
          >
            <ExitIcon className="h-[18px] w-[18px]" />
            Back to app
          </Link>
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs text-slate-400">Appearance</span>
            <ThemeToggleButton />
          </div>
        </div>
      </aside>
    </>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M11 2 4 12h5l-1 6 7-10h-5l1-6Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

function UsersIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <circle cx="7.5" cy="6.5" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 17c.5-3.2 2.6-5 5-5s4.5 1.8 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M13 4.2c1.3.3 2.3 1.5 2.3 2.9 0 1.4-1 2.6-2.3 2.9M15.5 12.3c1.9.5 3.2 1.9 3.5 4.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReceiptIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path
        d="M5 2.5h10v15l-2-1.3-1.5 1.3-1.5-1.3-1.5 1.3-1.5-1.3-2 1.3v-15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7.2 7h5.6M7.2 10h5.6M7.2 13h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

function MailIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MegaphoneIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path
        d="M2.5 8v4a1.5 1.5 0 0 0 1.5 1.5h1l.8 3.2a1 1 0 0 0 1 .8h.4a1 1 0 0 0 .97-1.24L7.3 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 8h2.2L14 4.2a.8.8 0 0 1 1.15.72v10.16a.8.8 0 0 1-1.15.72L6.2 13.5H4V8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M16.8 7.5a3 3 0 0 1 0 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ExitIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path
        d="M8 3H4.5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 4.5 17H8M13 13.5 17 10l-4-3.5M17 10H7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

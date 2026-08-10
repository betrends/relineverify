import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/currentUser";
import ThemeToggleButton from "@/components/ThemeToggleButton";

// Every /admin/* page is gated here — checked server-side on every request,
// so there's no client-side route to spoof around. Not an authorization
// system regular users can ever see or reach: unlike the customer
// dashboard, there is no link to this anywhere in the app's nav.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-ink-950 dark:text-paper-100">
      <header className="border-b border-slate-200 bg-white dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-display text-lg font-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16">
                  <path d="M11 3 5 12h4.2l-.8 5 6.6-9h-4.2l.8-5Z" fill="white" />
                </svg>
              </span>
              Reline Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link href="/admin" className="hover:text-slate-900 dark:hover:text-paper-100">
                Overview
              </Link>
              <Link href="/admin/users" className="hover:text-slate-900 dark:hover:text-paper-100">
                Users
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <ThemeToggleButton />
            <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-paper-100">
              Back to app
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

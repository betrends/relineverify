import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [
    userCount,
    walletTotal,
    revenueTotal,
    ordersCount,
    emailsCount,
    unsuccessfulTopups,
    recentUsers,
    recentTransactions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.aggregate({ _sum: { walletBalance: true } }),
    prisma.transaction.aggregate({
      where: { type: "topup", status: "successful" },
      _sum: { amount: true },
    }),
    prisma.order.count(),
    prisma.generatedEmail.count(),
    prisma.transaction.aggregate({
      where: { type: "topup", status: { in: ["pending", "failed"] } },
      _count: true,
      _sum: { amount: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, email: true, name: true, walletBalance: true, createdAt: true, emailVerifiedAt: true },
    }),
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { id: true, email: true, name: true } } },
    }),
  ]);

  const stats = [
    { label: "Total users", value: userCount.toLocaleString(), href: "/admin/users" },
    { label: "Total wallet balance held", value: `₦${(walletTotal._sum.walletBalance ?? 0).toLocaleString()}` },
    { label: "Total top-ups received", value: `₦${(revenueTotal._sum.amount ?? 0).toLocaleString()}`, href: "/admin/transactions?type=topup&status=successful" },
    { label: "Numbers purchased", value: ordersCount.toLocaleString(), href: "/admin/orders" },
    { label: "Emails generated", value: emailsCount.toLocaleString(), href: "/admin/emails" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-700 tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Live snapshot of your Reline platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const card = (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-ink-700 dark:bg-ink-900 dark:hover:bg-ink-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="hover:-translate-y-0.5 hover:shadow-md transition-transform">
              {card}
            </Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>

      <Link
        href="/admin/transactions?status=unsuccessful&type=topup"
        className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm transition-colors hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/20"
      >
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Top-ups that didn&apos;t go through</p>
          <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-300/70">
            People who tried adding funds but the payment never completed — pending or failed.
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-700 text-amber-800 dark:text-amber-300">
            {(unsuccessfulTopups._count ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-amber-700/80 dark:text-amber-300/70">
            ₦{(unsuccessfulTopups._sum.amount ?? 0).toLocaleString()} attempted
          </p>
        </div>
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-ink-800">
            <h2 className="font-display text-lg font-700">Recent signups</h2>
            <Link href="/admin/users" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-ink-800">
            {recentUsers.map((u) => (
              <Link
                key={u.id}
                href={`/admin/users/${u.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-ink-800"
              >
                <div>
                  <p className="text-sm font-medium">{u.name || "—"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono">₦{u.walletBalance.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">
                    {u.emailVerifiedAt ? "Verified" : "Unverified"} · {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-ink-800">
            <h2 className="font-display text-lg font-700">Recent transactions</h2>
            <Link href="/admin/transactions" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-ink-800">
            {recentTransactions.map((t) => (
              <Link
                key={t.id}
                href={`/admin/users/${t.user.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-ink-800"
              >
                <div>
                  <p className="text-sm font-medium capitalize">{t.type}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono">₦{t.amount.toLocaleString()}</p>
                  <p
                    className={`text-xs capitalize ${
                      t.status === "successful"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : t.status === "failed"
                          ? "text-red-600 dark:text-red-400"
                          : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {t.status}
                  </p>
                </div>
              </Link>
            ))}
            {recentTransactions.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No transactions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

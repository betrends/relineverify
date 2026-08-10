import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [userCount, walletTotal, revenueTotal, ordersCount, emailsCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.aggregate({ _sum: { walletBalance: true } }),
    prisma.transaction.aggregate({
      where: { type: "topup", status: "successful" },
      _sum: { amount: true },
    }),
    prisma.order.count(),
    prisma.generatedEmail.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, email: true, name: true, walletBalance: true, createdAt: true, emailVerifiedAt: true },
    }),
  ]);

  const stats = [
    { label: "Total users", value: userCount.toLocaleString() },
    { label: "Total wallet balance held", value: `₦${(walletTotal._sum.walletBalance ?? 0).toLocaleString()}` },
    { label: "Total top-ups received", value: `₦${(revenueTotal._sum.amount ?? 0).toLocaleString()}` },
    { label: "Numbers purchased", value: ordersCount.toLocaleString() },
    { label: "Emails generated", value: emailsCount.toLocaleString() },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-700 tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Live snapshot of your Reline platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-ink-700 dark:bg-ink-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-ink-800">
          <h2 className="font-display text-lg font-700">Recent signups</h2>
          <Link href="/admin/users" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300">
            View all users
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
    </div>
  );
}

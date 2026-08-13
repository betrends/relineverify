import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/admin/StatusBadge";

const PAGE_SIZE = 30;

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "unsuccessful", label: "Pending or failed (didn't go through)" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "topup", label: "Top-up" },
  { value: "purchase", label: "Purchase" },
  { value: "refund", label: "Refund" },
  { value: "email", label: "Email" },
  { value: "referral", label: "Referral" },
];

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; type?: string; page?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const status = searchParams.status || "";
  const type = searchParams.type || "";
  const page = Math.max(1, Number(searchParams.page) || 1);

  const where: Record<string, unknown> = {};
  if (status === "unsuccessful") where.status = { in: ["pending", "failed"] };
  else if (status) where.status = status;
  if (type) where.type = type;
  if (q) {
    where.user = {
      OR: [
        { email: { contains: q, mode: "insensitive" as const } },
        { name: { contains: q, mode: "insensitive" as const } },
      ],
    };
  }

  const [total, transactions, failedOrPendingTopups] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { id: true, email: true, name: true } } },
    }),
    prisma.transaction.aggregate({
      where: { type: "topup", status: { in: ["pending", "failed"] } },
      _count: true,
      _sum: { amount: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildQuery(overrides: Record<string, string>) {
    const params = new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), ...(type ? { type } : {}) });
    Object.entries(overrides).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    return `/admin/transactions?${params}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-700 tracking-tight">Transactions</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{total.toLocaleString()} total</p>
      </div>

      <Link
        href="/admin/transactions?status=unsuccessful&type=topup"
        className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm transition-colors hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/20"
      >
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Top-ups that didn&apos;t go through
          </p>
          <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-300/70">
            People who tried adding funds but the payment never completed — pending or failed.
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-700 text-amber-800 dark:text-amber-300">
            {(failedOrPendingTopups._count ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-amber-700/80 dark:text-amber-300/70">
            ₦{(failedOrPendingTopups._sum.amount ?? 0).toLocaleString()} attempted
          </p>
        </div>
      </Link>

      <form method="GET" className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by user email or name"
          className="w-64 rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          name="type"
          defaultValue={type}
          className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          Filter
        </button>
        {(q || status || type) && (
          <Link href="/admin/transactions" className="text-sm text-slate-500 hover:underline dark:text-slate-400">
            Clear
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-ink-800">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Reference</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-ink-800">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-ink-800">
                <td className="px-5 py-3.5">
                  <Link href={`/admin/users/${t.user.id}`} className="block">
                    <p className="font-medium text-slate-900 dark:text-paper-100">{t.user.name || "—"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.user.email}</p>
                  </Link>
                </td>
                <td className="px-5 py-3.5 capitalize text-slate-600 dark:text-slate-400">{t.type}</td>
                <td className="px-5 py-3.5 font-mono">₦{t.amount.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={t.status} />
                </td>
                <td className="max-w-[220px] truncate px-5 py-3.5 font-mono text-xs text-slate-400" title={t.reference}>
                  {t.reference}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildQuery({ page: String(p) })}
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                p === page
                  ? "bg-violet-500 text-white"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-ink-800"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

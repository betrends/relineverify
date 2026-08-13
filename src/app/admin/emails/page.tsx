import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/admin/StatusBadge";
import UserAvatar from "@/components/admin/UserAvatar";

const PAGE_SIZE = 30;

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "received", label: "Received" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" },
];

export default async function AdminEmailsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const status = searchParams.status || "";
  const page = Math.max(1, Number(searchParams.page) || 1);

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { address: { contains: q, mode: "insensitive" as const } },
      { user: { email: { contains: q, mode: "insensitive" as const } } },
    ];
  }

  const [total, emails] = await Promise.all([
    prisma.generatedEmail.count({ where }),
    prisma.generatedEmail.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { id: true, email: true, name: true } } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildQuery(overrides: Record<string, string>) {
    const params = new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}) });
    Object.entries(overrides).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    return `/admin/emails?${params}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-700 tracking-tight">Emails</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{total.toLocaleString()} generated addresses</p>
      </div>

      <form method="GET" className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search address or user email"
          className="w-72 rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900"
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
        <button type="submit" className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          Filter
        </button>
        {(q || status) && (
          <Link href="/admin/emails" className="text-sm text-slate-500 hover:underline dark:text-slate-400">
            Clear
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-ink-800">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Address</th>
              <th className="px-5 py-3 font-medium">Charged</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-ink-800">
            {emails.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-ink-800">
                <td className="px-5 py-3.5">
                  <Link href={`/admin/users/${e.user.id}`} className="flex items-center gap-3">
                    <UserAvatar name={e.user.name} email={e.user.email} className="h-8 w-8 text-xs" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-paper-100">{e.user.name || "—"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{e.user.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="max-w-[220px] truncate px-5 py-3.5 font-mono text-xs" title={e.address}>
                  {e.address}
                </td>
                <td className="px-5 py-3.5 font-mono">₦{e.costCharged.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {emails.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No emails found.
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

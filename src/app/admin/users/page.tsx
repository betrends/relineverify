import Link from "next/link";
import { prisma } from "@/lib/prisma";
import UserAvatar from "@/components/admin/UserAvatar";

const PAGE_SIZE = 25;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const page = Math.max(1, Number(searchParams.page) || 1);

  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" as const } },
          { name: { contains: q, mode: "insensitive" as const } },
          { phone: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        walletBalance: true,
        emailVerifiedAt: true,
        isAdmin: true,
        createdAt: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{total.toLocaleString()} total</p>
        </div>
        <form method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by email, name, or phone"
            className="w-72 rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900"
          />
          <button
            type="submit"
            className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Search
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-ink-800">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Wallet</th>
              <th className="px-5 py-3 font-medium">Verified</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-ink-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-ink-800">
                <td className="px-5 py-3.5">
                  <Link href={`/admin/users/${u.id}`} className="flex items-center gap-3">
                    <UserAvatar name={u.name} email={u.email} className="h-9 w-9" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-paper-100">
                        {u.name || "—"} {u.isAdmin && <span className="ml-1 text-xs text-violet-500">(admin)</span>}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{u.phone || "—"}</td>
                <td className="px-5 py-3.5 font-mono">₦{u.walletBalance.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  {u.emailVerifiedAt ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                      Verified
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-ink-800 dark:text-slate-400">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No users found.
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
              href={`/admin/users?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`}
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

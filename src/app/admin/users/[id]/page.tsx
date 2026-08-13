import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminUserActions from "@/components/admin/AdminUserActions";
import StatusBadge from "@/components/admin/StatusBadge";
import TransactionTypeTag from "@/components/admin/TransactionTypeTag";
import UserAvatar from "@/components/admin/UserAvatar";
import ServiceIcon from "@/components/ServiceIcon";
import StatIcon, { CalendarGlyph, CheckGlyph, PhoneGlyph, WalletGlyph } from "@/components/admin/StatIcon";

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    // Explicit field list — deliberately never includes passwordHash. Using
    // `include` here would pull every scalar column (hash included) into
    // server memory even though nothing on this page renders it; `select`
    // keeps that data out of the query entirely.
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      walletBalance: true,
      emailVerifiedAt: true,
      isAdmin: true,
      createdAt: true,
      referralCode: true,
      orders: { orderBy: { createdAt: "desc" }, take: 20 },
      generatedEmails: { orderBy: { createdAt: "desc" }, take: 20 },
      transactions: { orderBy: { createdAt: "desc" }, take: 30 },
      referrals: { select: { id: true, email: true, name: true, createdAt: true } },
      referredBy: { select: { id: true, email: true, name: true } },
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/users" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300">
          ← Back to users
        </Link>
        <div className="mt-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar name={user.name} email={user.email} className="h-12 w-12 text-base" />
            <div>
              <h1 className="font-display text-2xl font-700 tracking-tight">{user.name || "Unnamed user"}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          {user.isAdmin && (
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              Admin
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard label="Wallet balance" value={`₦${user.walletBalance.toLocaleString()}`} color="violet" icon={<WalletGlyph />} />
        <InfoCard label="Phone" value={user.phone || "—"} color="sky" icon={<PhoneGlyph />} />
        <InfoCard
          label="Email verified"
          value={user.emailVerifiedAt ? new Date(user.emailVerifiedAt).toLocaleDateString() : "No"}
          color={user.emailVerifiedAt ? "emerald" : "amber"}
          icon={<CheckGlyph />}
        />
        <InfoCard label="Joined" value={new Date(user.createdAt).toLocaleDateString()} color="rose" icon={<CalendarGlyph />} />
      </div>

      <AdminUserActions
        userId={user.id}
        initialName={user.name || ""}
        initialPhone={user.phone || ""}
        initialEmail={user.email}
      />

      {(user.referralCode || user.referredBy || user.referrals.length > 0) && (
        <Section title="Referrals">
          <div className="space-y-2 px-5 py-4 text-sm">
            {user.referralCode && (
              <p>
                <span className="text-slate-500 dark:text-slate-400">Their code:</span>{" "}
                <span className="font-mono">{user.referralCode}</span>
              </p>
            )}
            {user.referredBy && (
              <p>
                <span className="text-slate-500 dark:text-slate-400">Referred by:</span>{" "}
                <Link href={`/admin/users/${user.referredBy.id}`} className="text-violet-600 hover:underline dark:text-violet-300">
                  {user.referredBy.name || user.referredBy.email}
                </Link>
              </p>
            )}
            {user.referrals.length > 0 && (
              <p className="text-slate-500 dark:text-slate-400">
                Has referred {user.referrals.length} {user.referrals.length === 1 ? "person" : "people"}.
              </p>
            )}
          </div>
        </Section>
      )}

      <Section title={`Numbers purchased (${user.orders.length})`} viewAllHref={`/admin/orders?q=${encodeURIComponent(user.email)}`}>
        <Table
          headers={["Service", "Country", "Number", "Charged", "Status", "Date"]}
          rows={user.orders.map((o) => [
            <span key="svc" className="flex items-center gap-2">
              <ServiceIcon name={o.serviceName} className="h-6 w-6 rounded-md" />
              {o.serviceName}
            </span>,
            o.countryName,
            o.number,
            `₦${o.costCharged.toLocaleString()}`,
            <StatusBadge key="s" status={o.status} />,
            new Date(o.createdAt).toLocaleString(),
          ])}
          empty="No numbers purchased yet."
        />
      </Section>

      <Section title={`Emails generated (${user.generatedEmails.length})`} viewAllHref={`/admin/emails?q=${encodeURIComponent(user.email)}`}>
        <Table
          headers={["Address", "Charged", "Status", "Date"]}
          rows={user.generatedEmails.map((e) => [
            e.address,
            `₦${e.costCharged.toLocaleString()}`,
            <StatusBadge key="s" status={e.status} />,
            new Date(e.createdAt).toLocaleString(),
          ])}
          empty="No emails generated yet."
        />
      </Section>

      <Section title={`Transactions (${user.transactions.length})`} viewAllHref={`/admin/transactions?q=${encodeURIComponent(user.email)}`}>
        <Table
          headers={["Type", "Amount", "Status", "Reference", "Date"]}
          rows={user.transactions.map((t) => [
            <TransactionTypeTag key="t" type={t.type} />,
            `₦${t.amount.toLocaleString()}`,
            <StatusBadge key="s" status={t.status} />,
            <span key="r" className="font-mono text-xs">{t.reference}</span>,
            new Date(t.createdAt).toLocaleString(),
          ])}
          empty="No transactions yet."
        />
      </Section>
    </div>
  );
}

function InfoCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color: Parameters<typeof StatIcon>[0]["color"];
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-ink-700 dark:bg-ink-900">
      <StatIcon color={color}>{icon}</StatIcon>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

function Section({
  title,
  viewAllHref,
  children,
}: {
  title: string;
  viewAllHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-ink-800">
        <h2 className="font-display text-lg font-700">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300">
            View all
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function Table({ headers, rows, empty }: { headers: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (rows.length === 0) {
    return <p className="px-5 py-8 text-center text-sm text-slate-400">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-ink-800">
            {headers.map((h) => (
              <th key={h} className="px-5 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-ink-800">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

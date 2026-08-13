import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import BroadcastForm from "@/components/admin/BroadcastForm";

export default async function AdminBroadcastPage() {
  const [userCount, admin] = await Promise.all([prisma.user.count(), getCurrentUser()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-700 tracking-tight">Broadcast</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Email every registered user at once. Always send yourself a test first.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <BroadcastForm userCount={userCount} adminEmail={admin!.email} />
      </div>
    </div>
  );
}

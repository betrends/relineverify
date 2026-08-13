import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { MobileNavProvider } from "@/components/dashboard/MobileNavProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

// Every /admin/* page is gated here — checked server-side on every request,
// so there's no client-side route to spoof around. Not an authorization
// system regular users can ever see or reach: unlike the customer
// dashboard, there is no link to this anywhere in the app's nav.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");

  return (
    <MobileNavProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-ink-950 dark:text-paper-100">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopBar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </MobileNavProvider>
  );
}

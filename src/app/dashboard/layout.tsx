import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { SearchProvider } from "@/components/dashboard/SearchProvider";
import { MobileNavProvider } from "@/components/dashboard/MobileNavProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import VerifyEmailBanner from "@/components/dashboard/VerifyEmailBanner";
import IdleLogout from "@/components/dashboard/IdleLogout";
import DashboardBackdrop from "@/components/motion/DashboardBackdrop";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <SearchProvider>
      <MobileNavProvider>
        <IdleLogout />
        <div id="top" className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-ink-950 dark:text-paper-100">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header email={user.email} name={user.name} />
            <VerifyEmailBanner />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
            <Footer />
          </div>
        </div>
      </MobileNavProvider>
    </SearchProvider>
  );
}

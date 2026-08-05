import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/currentUser";
import DashboardClient from "@/components/DashboardClient";
import Reveal from "@/components/motion/Reveal";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const fallback = user?.email.split("@")[0].replace(/[._-]/g, " ") || "there";
  const displayName = user?.name?.split(" ")[0] || fallback.charAt(0).toUpperCase() + fallback.slice(1);
  const t = await getTranslations("dashboard.home");

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
          {t("welcomeBack", { name: displayName })}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("subtitle")}</p>
      </Reveal>
      <div className="mt-8">
        <DashboardClient />
      </div>
    </div>
  );
}

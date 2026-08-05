import { getTranslations } from "next-intl/server";
import Reveal from "@/components/motion/Reveal";
import ReferralsClient from "@/components/dashboard/ReferralsClient";

export default async function ReferralsPage() {
  const t = await getTranslations("dashboard.pages");
  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
          {t("referralsTitle")}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("referralsSubtitle")}</p>
      </Reveal>

      <div className="mt-8">
        <ReferralsClient />
      </div>
    </div>
  );
}

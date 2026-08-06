import { getTranslations } from "next-intl/server";
import Reveal from "@/components/motion/Reveal";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import WalletCard from "@/components/WalletCard";

export default async function TransactionsPage() {
  const t = await getTranslations("dashboard.pages");
  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
          {t("transactionsTitle")}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("transactionsSubtitle")}</p>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
        <Reveal delay={0.05}>
          <WalletCard />
        </Reveal>

        <Reveal delay={0.1}>
          <TransactionHistory />
        </Reveal>
      </div>
    </div>
  );
}

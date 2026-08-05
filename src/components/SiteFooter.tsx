import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-slate-100 py-10 dark:border-ink-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-slate-500 dark:text-slate-500 sm:flex-row">
        <p>{t("tagline")}</p>
        <div className="flex items-center gap-5">
          <Link href="/terms" className="hover:text-slate-900 dark:hover:text-paper-100">
            {t("terms")}
          </Link>
          <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-paper-100">
            {t("privacy")}
          </Link>
          <Link href="/contact" className="hover:text-slate-900 dark:hover:text-paper-100">
            {t("contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

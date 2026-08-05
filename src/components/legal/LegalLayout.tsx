import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-ink-950 dark:text-paper-100">
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">{title}</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated {updated}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{children}</div>
      </section>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">{heading}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  );
}

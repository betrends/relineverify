const STYLES: Record<string, string> = {
  successful: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  received: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  failed: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
  expired: "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-400",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] || "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-400";
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style}`}>{status}</span>
  );
}

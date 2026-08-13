const STYLES: Record<string, string> = {
  topup: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  purchase: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
  refund: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  email: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  referral: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
};

export default function TransactionTypeTag({ type }: { type: string }) {
  const style = STYLES[type] || "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-400";
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style}`}>{type}</span>;
}

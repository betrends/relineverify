const PALETTE = [
  { bg: "bg-violet-100 dark:bg-violet-500/20", text: "text-violet-600 dark:text-violet-300" },
  { bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-300" },
  { bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-300" },
  { bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-300" },
  { bg: "bg-rose-100 dark:bg-rose-500/20", text: "text-rose-600 dark:text-rose-300" },
  { bg: "bg-sky-100 dark:bg-sky-500/20", text: "text-sky-600 dark:text-sky-300" },
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// A different, consistent color per person (hashed off their email) so
// admin tables read as a set of distinct people at a glance instead of a
// wall of identical gray rows — same idea as ServiceIcon's fallback swatch.
export default function UserAvatar({
  name,
  email,
  className = "h-9 w-9 text-sm",
}: {
  name?: string | null;
  email: string;
  className?: string;
}) {
  const label = (name || email).trim();
  const initials = label
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const swatch = PALETTE[hash(email) % PALETTE.length];

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-medium ${swatch.bg} ${swatch.text} ${className}`}
    >
      {initials || "?"}
    </span>
  );
}

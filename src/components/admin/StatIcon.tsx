const COLORS: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
  sky: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
};

export type StatColor = keyof typeof COLORS;

export default function StatIcon({ color, children }: { color: StatColor; children: React.ReactNode }) {
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${COLORS[color]}`}>
      {children}
    </span>
  );
}

export function UsersGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="7.5" cy="6.5" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 17c.5-3.2 2.6-5 5-5s4.5 1.8 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M13 4.2c1.3.3 2.3 1.5 2.3 2.9 0 1.4-1 2.6-2.3 2.9M15.5 12.3c1.9.5 3.2 1.9 3.5 4.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WalletGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 6.5C3 5.12 4.12 4 5.5 4h9A2.5 2.5 0 0 1 17 6.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 13.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M13 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="M3 8h11.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CoinsGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <ellipse cx="10" cy="5.5" rx="6" ry="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 5.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4M4 9.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HashGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M7.5 3 6 17M14 3l-1.5 14M4 8h13M3.3 12.5h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MailGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="5.5" y="2" width="9" height="16" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 15.2h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CheckGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m6.8 10.2 2.1 2.1 4.3-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 8h15M6.5 2.5v3M13.5 2.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AlertGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2.5 18.5 17h-17L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 8v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.9" fill="currentColor" />
    </svg>
  );
}

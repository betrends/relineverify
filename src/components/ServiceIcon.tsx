const PALETTE = [
  { bg: "bg-violet-100 dark:bg-violet-500/20", text: "text-violet-600 dark:text-violet-300" },
  { bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-300" },
  { bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-300" },
  { bg: "bg-rose-100 dark:bg-rose-500/20", text: "text-rose-600 dark:text-rose-300" },
  { bg: "bg-sky-100 dark:bg-sky-500/20", text: "text-sky-600 dark:text-sky-300" },
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function ServiceIcon({ name, className = "h-10 w-10" }: { name: string; className?: string }) {
  const key = name.toLowerCase();

  if (key.includes("whatsapp")) {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white ${className}`}>
        <WhatsAppGlyph />
      </span>
    );
  }
  if (key.includes("telegram")) {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white ${className}`}>
        <TelegramGlyph />
      </span>
    );
  }

  const swatch = PALETTE[hash(name) % PALETTE.length];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${swatch.bg} ${swatch.text} ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function WhatsAppGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3a7 7 0 0 0-6 10.6L3 17l3.5-1a7 7 0 1 0 3.5-13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 8c.2 2 2 3.8 4 4l.7-1c.9.3 1.7.5 1.7.5s0 1.3-.9 1.6c-1 .4-2.7-.2-4.3-1.8S6.4 8 6.8 7c.3-.9 1.6-.9 1.6-.9s.2.8.5 1.7l-1 .8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TelegramGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="m3 10.3 13-5.4c.6-.3 1.2.2 1 .9l-2.2 10.6c-.2.8-1 1-1.6.6l-3.5-2.6-1.8 1.8c-.2.2-.5.2-.6-.1l-.4-3 8-6.6-9.5 5.4-2.1-.7c-.7-.2-.8-1 .1-1.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

type Brand = {
  match: (key: string) => boolean;
  bg: string;
  fg: string;
  Glyph: () => React.ReactNode;
};

// Simplified, hand-drawn glyphs in each brand's real color — not traced
// from official logo files, but recognizable enough to scan a grid by eye.
// Covers the platforms visitors are most likely to look for; anything else
// falls back to a colored initial below.
const BRANDS: Brand[] = [
  { match: (k) => k.includes("whatsapp"), bg: "bg-emerald-500", fg: "text-white", Glyph: WhatsAppGlyph },
  { match: (k) => k.includes("telegram"), bg: "bg-sky-500", fg: "text-white", Glyph: TelegramGlyph },
  { match: (k) => k.includes("facebook"), bg: "bg-[#1877F2]", fg: "text-white", Glyph: () => <Monogram text="f" /> },
  { match: (k) => k.includes("instagram"), bg: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", fg: "text-white", Glyph: InstagramGlyph },
  { match: (k) => k === "twitter" || k.includes("twitter"), bg: "bg-black", fg: "text-white", Glyph: XGlyph },
  { match: (k) => k.includes("tiktok"), bg: "bg-black", fg: "text-white", Glyph: TikTokGlyph },
  { match: (k) => k.includes("snapchat"), bg: "bg-[#FFFC00]", fg: "text-black", Glyph: SnapchatGlyph },
  { match: (k) => k.includes("discord"), bg: "bg-[#5865F2]", fg: "text-white", Glyph: DiscordGlyph },
  { match: (k) => k.includes("linkedin"), bg: "bg-[#0A66C2]", fg: "text-white", Glyph: () => <Monogram text="in" /> },
  { match: (k) => k.includes("google") || k.includes("gmail") || k.includes("youtube"), bg: "bg-white border border-slate-200", fg: "text-slate-900", Glyph: GoogleGlyph },
  { match: (k) => k === "apple" || k.includes("apple"), bg: "bg-black", fg: "text-white", Glyph: AppleGlyph },
  { match: (k) => k.includes("microsoft"), bg: "bg-white border border-slate-200", fg: "", Glyph: MicrosoftGlyph },
  { match: (k) => k === "amazon" || k.includes("amazon"), bg: "bg-[#131A22]", fg: "text-[#FF9900]", Glyph: AmazonGlyph },
  { match: (k) => k.includes("netflix"), bg: "bg-black", fg: "text-[#E50914]", Glyph: NetflixGlyph },
  { match: (k) => k.includes("paypal"), bg: "bg-[#003087]", fg: "text-white", Glyph: PaypalGlyph },
  { match: (k) => k === "uber" || k.includes("uber"), bg: "bg-black", fg: "text-white", Glyph: () => <Monogram text="U" /> },
  { match: (k) => k.includes("airbnb"), bg: "bg-[#FF5A5F]", fg: "text-white", Glyph: AirbnbGlyph },
  { match: (k) => k.includes("tinder"), bg: "bg-gradient-to-br from-[#FF7854] to-[#FD267A]", fg: "text-white", Glyph: FlameGlyph },
  { match: (k) => k.includes("signal"), bg: "bg-[#3A76F0]", fg: "text-white", Glyph: BubbleCheckGlyph },
  { match: (k) => k.includes("steam"), bg: "bg-[#1B2838]", fg: "text-white", Glyph: SteamGlyph },
  { match: (k) => k.includes("binance"), bg: "bg-[#181A20]", fg: "text-[#F0B90B]", Glyph: () => <Monogram text="B" /> },
  { match: (k) => k.includes("openai") || k.includes("chatgpt"), bg: "bg-black", fg: "text-[#10A37F]", Glyph: OpenAIGlyph },
  { match: (k) => k.includes("skype"), bg: "bg-[#00AFF0]", fg: "text-white", Glyph: () => <Monogram text="S" /> },
  { match: (k) => k.includes("twitch"), bg: "bg-[#9146FF]", fg: "text-white", Glyph: TwitchGlyph },
  { match: (k) => k === "line", bg: "bg-[#06C755]", fg: "text-white", Glyph: BubbleGlyph },
  { match: (k) => k.includes("viber"), bg: "bg-[#7360F2]", fg: "text-white", Glyph: PhoneGlyph },
  { match: (k) => k.includes("ebay"), bg: "bg-[#E53238]", fg: "text-white", Glyph: () => <Monogram text="e" /> },
  { match: (k) => k.includes("coinbase"), bg: "bg-[#0052FF]", fg: "text-white", Glyph: () => <Monogram text="C" /> },
  { match: (k) => k.includes("grab"), bg: "bg-[#00B14F]", fg: "text-white", Glyph: () => <Monogram text="G" /> },
  { match: (k) => k.includes("yahoo"), bg: "bg-[#6001D2]", fg: "text-white", Glyph: () => <Monogram text="Y!" small /> },
  { match: (k) => k.includes("kakao"), bg: "bg-[#FEE500]", fg: "text-black", Glyph: BubbleGlyph },
  { match: (k) => k === "imo" || k.includes("imo"), bg: "bg-[#00A3E0]", fg: "text-white", Glyph: PhoneGlyph },
  { match: (k) => k.includes("bumble"), bg: "bg-[#FFC629]", fg: "text-black", Glyph: () => <Monogram text="B" /> },
  { match: (k) => k.includes("truecaller"), bg: "bg-[#0DBEFF]", fg: "text-white", Glyph: PhoneGlyph },
];

export default function ServiceIcon({ name, className = "h-10 w-10" }: { name: string; className?: string }) {
  const key = name.toLowerCase();
  const brand = BRANDS.find((b) => b.match(key));

  if (brand) {
    const { Glyph } = brand;
    return (
      <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${brand.bg} ${brand.fg} ${className}`}>
        <Glyph />
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

function Monogram({ text, small = false }: { text: string; small?: boolean }) {
  return <span className={`font-display font-700 ${small ? "text-[11px]" : "text-sm"}`}>{text}</span>;
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

function InstagramGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function XGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M4 4l12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TikTokGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M11 3v9.2a2.3 2.3 0 1 1-2-2.28"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 3c.2 2 1.8 3.5 3.8 3.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SnapchatGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3.5c2.2 0 3.6 1.7 3.6 4v1.3c0 .3.5.9 1.1 1 .5.1.9.5.7 1-.2.4-.9.6-1.3.8-.3.1-.4.4-.2.7.4.6 1.2 1.1 2.1 1.3.3 0 .4.4.1.6-.4.3-1 .5-1.6.6-.1 0-.3.1-.3.3 0 .2-.1.5-.5.5-1 0-1.6.6-3.7.6s-2.7-.6-3.7-.6c-.4 0-.5-.3-.5-.5 0-.2-.2-.3-.3-.3-.6-.1-1.2-.3-1.6-.6-.3-.2-.2-.6.1-.6.9-.2 1.7-.7 2.1-1.3.2-.3.1-.6-.2-.7-.4-.2-1.1-.4-1.3-.8-.2-.5.2-.9.7-1 .6-.1 1.1-.7 1.1-1V7.5c0-2.3 1.4-4 3.6-4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M6 5.5c1.3-.6 2.6-.6 4-.6s2.7 0 4 .6c1.2 1.8 1.8 3.8 1.6 6-1 .8-2.3 1.3-3.6 1.5l-.5-1c.6-.2 1.1-.5 1.6-.8-1.9.9-4.2.9-6.2 0 .5.3 1 .6 1.6.8l-.5 1c-1.3-.2-2.6-.7-3.6-1.5-.2-2.2.4-4.2 1.6-6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="10" r="0.9" fill="currentColor" />
      <circle cx="12" cy="10" r="0.9" fill="currentColor" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M17.6 10.2c0-.6-.1-1.2-.2-1.7h-7.3v3.3h4.2c-.2 1-.7 1.9-1.6 2.5v2h2.6c1.5-1.4 2.3-3.5 2.3-6.1Z"
        fill="#4285F4"
      />
      <path
        d="M10.1 17.9c2.1 0 3.9-.7 5.2-1.9l-2.6-2c-.7.5-1.6.8-2.6.8-2 0-3.7-1.4-4.3-3.2H3v2c1.3 2.6 4 4.3 7.1 4.3Z"
        fill="#34A853"
      />
      <path d="M5.8 11.6c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6v-2H3a8 8 0 0 0 0 7.2l2.8-2Z" fill="#FBBC05" />
      <path
        d="M10.1 5.6c1.1 0 2.1.4 2.9 1.2l2.2-2.2c-1.3-1.2-3.1-2-5.1-2-3.1 0-5.8 1.7-7.1 4.3l2.8 2c.6-1.8 2.3-3.3 4.3-3.3Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.8 3.6c.1 1-.3 2-.9 2.7-.6.7-1.6 1.3-2.5 1.2-.1-1 .3-2 .9-2.7.6-.7 1.7-1.2 2.5-1.2Z" />
      <path d="M15.9 14c-.4.9-.6 1.3-1.1 2.1-.7 1.1-1.7 2.5-2.9 2.5-1.1 0-1.4-.7-2.8-.7s-1.8.7-2.9.7c-1.2 0-2.1-1.2-2.8-2.3-1.9-3-2.1-6.4-.9-8.3.8-1.3 2.1-2.1 3.4-2.1 1.2 0 2 .8 3 .8.9 0 1.6-.8 3-.8 1 0 2.1.6 2.9 1.6-2.5 1.4-2.1 5.1.1 6.5Z" />
    </svg>
  );
}

function MicrosoftGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20">
      <rect x="3" y="3" width="6.2" height="6.2" fill="#F25022" />
      <rect x="10.3" y="3" width="6.2" height="6.2" fill="#7FBA00" />
      <rect x="3" y="10.3" width="6.2" height="6.2" fill="#00A4EF" />
      <rect x="10.3" y="10.3" width="6.2" height="6.2" fill="#FFB900" />
    </svg>
  );
}

function AmazonGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M4 12c3 2 9 2.4 12.3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14.5 10.5c.8-.1 2 0 2.4.5.3.4-.1 1.6-.5 2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6 9.5V7.8c0-1.3 1.1-2.3 2.5-2.3s2.5 1 2.5 2.3v3.9c0 .6.2 1 .6 1.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M6 9.8c1.7-.9 3.3-.9 5 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function NetflixGlyph() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 20" fill="currentColor">
      <path d="M2 2h3l5 16H7L2 2Z" />
      <path d="M9 2h3v16H9V2Z" opacity="0.55" />
    </svg>
  );
}

function PaypalGlyph() {
  return (
    <svg width="16" height="18" viewBox="0 0 18 20" fill="none">
      <path
        d="M5 17 7 4h4.3c2 0 3.4 1.3 3 3.3-.4 2.4-2.4 3.9-4.8 3.9H7.6l-.8 5.8H5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8 17 9.8 6.3h4c2 0 3.2 1.2 2.9 3.1-.4 2.3-2.3 3.7-4.6 3.7H9.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

function AirbnbGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3.5c1 1.6 4.4 6.9 4.4 9.3a4.4 4.4 0 0 1-8.8 0c0-2.4 3.4-7.7 4.4-9.3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="12.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FlameGlyph() {
  return (
    <svg width="16" height="18" viewBox="0 0 18 20" fill="currentColor">
      <path d="M9 2c1 3 4.5 5 4.5 9.5a4.5 4.5 0 1 1-9 0c0-1.6.9-2.6 1.6-3.4-.1 1 .2 1.8.8 2.1C6.2 8 8 6 9 2Z" />
    </svg>
  );
}

function BubbleCheckGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M17 10a7 7 0 1 1-3.2-5.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 10.3 9 12.3 15 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SteamGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="13" cy="12.5" r="1.6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9.3 8.7 11.7 11" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function OpenAIGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 3.5 15.5 7v6L10 16.5 4.5 13V7L10 3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function TwitchGlyph() {
  return (
    <svg width="16" height="18" viewBox="0 0 18 20" fill="none">
      <path d="M4 2h12v9.5l-3.5 3.5H9l-2.5 2.5v-2.5H4V2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 6v4M13 6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BubbleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 4.5c3.6 0 6.5 2.2 6.5 5s-2.9 5-6.5 5c-.6 0-1.2 0-1.8-.2L5 16l.9-2.6c-1.5-.9-2.4-2.3-2.4-3.9 0-2.8 2.9-5 6.5-5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="M6.5 3.5c.6 0 1.4 1.6 1.6 2.2.2.5 0 .9-.3 1.2l-.9.8c.5 1.4 1.7 2.6 3.1 3.1l.8-.9c.3-.3.7-.5 1.2-.3.6.2 2.2 1 2.2 1.6 0 1.3-1 2.8-2.4 2.8-4 0-7.2-3.2-7.2-7.2 0-1.4 1.5-2.4 2.9-2.3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

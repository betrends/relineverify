// Verification emails are very often HTML-formatted (styled tables,
// tracking pixels, etc.), and Guerrilla Mail hands us that raw HTML as
// `emailText`. Before this existed, extractCode() searched the raw markup
// directly — usually failing to find a code at all — and a couple of UI
// fallback paths displayed that raw HTML straight to the user when no code
// was found, dumping `<table border="0" ...>` etc. into the dashboard.
// This strips it down to plain, readable text first.
export function stripHtml(html: string | null): string {
  if (!html) return "";
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

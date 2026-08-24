import { getSetting } from "./siteSettings";

export function parseMarkupPercent(raw: string | number | undefined | null): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 30;
}

/** Admin-editable via /admin/settings (falls back to the MARKUP_PERCENT env var, then 30). */
export async function getMarkupPercent(): Promise<number> {
  return parseMarkupPercent(await getSetting("markupPercent"));
}

export function calculateMarkedUpPrice(baseCostNgn: number, pct: number): number {
  return Math.ceil(baseCostNgn * (1 + pct / 100));
}

/** Converts a raw Talktiyu base cost (NGN) into what we charge the end user. */
export async function applyMarkup(baseCostNgn: number): Promise<number> {
  const pct = await getMarkupPercent();
  return calculateMarkedUpPrice(baseCostNgn, pct);
}

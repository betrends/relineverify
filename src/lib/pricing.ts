export function getMarkupPercent(): number {
  const raw = Number(process.env.MARKUP_PERCENT ?? 30);
  return Number.isFinite(raw) && raw >= 0 ? raw : 30;
}

/** Converts a raw Talktiyu base cost (NGN) into what we charge the end user. */
export function applyMarkup(baseCostNgn: number): number {
  const pct = getMarkupPercent();
  return Math.ceil(baseCostNgn * (1 + pct / 100));
}

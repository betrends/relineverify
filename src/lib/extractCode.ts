export function extractCode(text: string | null): string | null {
  if (!text) return null;
  const match = text.match(/\d[\d\s-]{2,}\d/);
  return match ? match[0].replace(/[\s-]/g, "") : null;
}

import { stripHtml } from "./stripHtml";

export function extractCode(text: string | null): string | null {
  if (!text) return null;
  const plain = stripHtml(text);
  const match = plain.match(/\d[\d\s-]{2,}\d/);
  return match ? match[0].replace(/[\s-]/g, "") : null;
}

/**
 * Generic key/value store (backed by the SiteSetting table) for small
 * pieces of content/config an admin wants to change live, without asking
 * a developer or waiting on a redeploy — the homepage tutorial video,
 * pricing markup, referral reward %, and public contact details.
 *
 * Never put secrets here (API keys, tokens) — those stay in Vercel env
 * vars, out of the database and out of any admin-editable UI.
 */
import { prisma } from "./prisma";

export const SETTINGS = {
  tutorialVideoUrl: {
    label: "Homepage tutorial video (YouTube URL)",
    default: "",
  },
  markupPercent: {
    label: "Pricing markup (%)",
    default: String(process.env.MARKUP_PERCENT ?? 30),
  },
  referralPercent: {
    label: "Referral reward (%)",
    default: "5",
  },
  supportEmail: {
    label: "Support email",
    default: "mgbedikekosi34@gmail.com",
  },
  whatsappNumber: {
    label: "Support WhatsApp number",
    default: "2347077653808",
  },
} as const;

export type SettingKey = keyof typeof SETTINGS;

// Settings are read on nearly every request (pricing, in particular) but
// change rarely — a short in-memory cache avoids a DB round trip per
// request while still picking up admin edits within a minute. Same
// pattern as talktiyu.ts's catalog cache.
const CACHE_TTL_MS = 60 * 1000;
const cache = new Map<string, { value: string; expires: number }>();

export async function getSetting(key: SettingKey): Promise<string> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;

  const row = await prisma.siteSetting.findUnique({ where: { key } });
  const value = row?.value ?? SETTINGS[key].default;
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

export async function getAllSettings(): Promise<Record<SettingKey, string>> {
  const rows = await prisma.siteSetting.findMany();
  const byKey = new Map(rows.map((r) => [r.key, r.value]));
  const out = {} as Record<SettingKey, string>;
  for (const key of Object.keys(SETTINGS) as SettingKey[]) {
    out[key] = byKey.get(key) ?? SETTINGS[key].default;
  }
  return out;
}

export async function setSetting(key: SettingKey, value: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
}

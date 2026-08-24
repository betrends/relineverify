import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/requireAdmin";
import { SETTINGS, getAllSettings, setSetting, type SettingKey } from "@/lib/siteSettings";

const KEYS = Object.keys(SETTINGS) as [SettingKey, ...SettingKey[]];

const schema = z.object({
  key: z.enum(KEYS),
  value: z.string().trim().max(2000),
});

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  return NextResponse.json({ settings: await getAllSettings() });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  if (parsed.data.key === "tutorialVideoUrl" && parsed.data.value) {
    try {
      const url = new URL(parsed.data.value);
      const isYouTube = /(^|\.)youtube\.com$/.test(url.hostname) || url.hostname === "youtu.be";
      if (!isYouTube) {
        return NextResponse.json({ error: "That doesn't look like a YouTube link" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Enter a valid URL" }, { status: 400 });
    }
  }

  if ((parsed.data.key === "markupPercent" || parsed.data.key === "referralPercent") && parsed.data.value) {
    const n = Number(parsed.data.value);
    if (!Number.isFinite(n) || n < 0 || n > 500) {
      return NextResponse.json({ error: "Enter a percentage between 0 and 500" }, { status: 400 });
    }
  }

  if (parsed.data.key === "supportEmail" && parsed.data.value) {
    const emailOk = z.string().email().safeParse(parsed.data.value).success;
    if (!emailOk) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  await setSetting(parsed.data.key, parsed.data.value);
  return NextResponse.json({ settings: await getAllSettings() });
}

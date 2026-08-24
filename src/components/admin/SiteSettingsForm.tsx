"use client";

import { useState } from "react";
import type { SettingKey } from "@/lib/siteSettings";

function SettingField({
  settingKey,
  label,
  hint,
  initialValue,
  placeholder,
  type = "text",
}: {
  settingKey: SettingKey;
  label: string;
  hint?: string;
  initialValue: string;
  placeholder?: string;
  type?: "text" | "email" | "number" | "url";
}) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirty = value !== initialValue;

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: settingKey, value: value.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not save");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-b border-slate-100 py-4 last:border-b-0 dark:border-ink-800">
      <label className="text-sm font-medium text-slate-700 dark:text-paper-100">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          type={type}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-950"
        />
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
      {saved && <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400">Saved.</p>}
    </div>
  );
}

export default function SiteSettingsForm({ settings }: { settings: Record<SettingKey, string> }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <h2 className="font-display text-lg font-700">Homepage</h2>
        <div className="mt-2">
          <SettingField
            settingKey="tutorialVideoUrl"
            label="Tutorial video (YouTube link)"
            hint="Paste a YouTube URL to show a 'Watch how it works' section on the homepage. Leave blank to hide it."
            initialValue={settings.tutorialVideoUrl}
            placeholder="https://www.youtube.com/watch?v=..."
            type="url"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <h2 className="font-display text-lg font-700">Pricing & referrals</h2>
        <div className="mt-2">
          <SettingField
            settingKey="markupPercent"
            label="Markup on numbers/emails (%)"
            hint="Added on top of Talktiyu's base price for every number and email. Takes effect immediately, no redeploy needed."
            initialValue={settings.markupPercent}
            type="number"
          />
          <SettingField
            settingKey="referralPercent"
            label="Referral reward (%)"
            hint="Percentage of a referred user's top-up paid to whoever referred them."
            initialValue={settings.referralPercent}
            type="number"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <h2 className="font-display text-lg font-700">Contact details</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Shown on the Contact page, the dashboard Support page, Terms, Privacy, and used as the reply-to for the
          contact form.
        </p>
        <div className="mt-2">
          <SettingField
            settingKey="supportEmail"
            label="Support email"
            initialValue={settings.supportEmail}
            type="email"
          />
          <SettingField
            settingKey="whatsappNumber"
            label="Support WhatsApp number"
            hint="Digits only, with country code, no + or spaces (e.g. 2347077653808)."
            initialValue={settings.whatsappNumber}
          />
        </div>
      </div>
    </div>
  );
}

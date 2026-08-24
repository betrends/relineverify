import { getAllSettings } from "@/lib/siteSettings";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getAllSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-700 tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Change these yourself, live — no need to ask for a code change.
        </p>
      </div>

      <div className="max-w-2xl">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}

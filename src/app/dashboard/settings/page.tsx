import Reveal from "@/components/motion/Reveal";
import SettingsClient from "@/components/dashboard/SettingsClient";

export default function SettingsPage() {
  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your profile, password, and account.
        </p>
      </Reveal>

      <div className="mt-8">
        <SettingsClient />
      </div>
    </div>
  );
}

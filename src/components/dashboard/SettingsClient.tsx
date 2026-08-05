"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import MotionButton from "../motion/MotionButton";
import AnimatedError from "../motion/AnimatedError";
import HoverLift from "../motion/HoverLift";
import Reveal from "../motion/Reveal";

type Me = {
  email: string;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  hasPassword: boolean;
  hasGoogle: boolean;
  emailVerified: boolean;
};

export default function SettingsClient() {
  const t = useTranslations("dashboard.settings");
  const [me, setMe] = useState<Me | null>(null);
  const [justVerified, setJustVerified] = useState(false);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setMe);

    if (new URLSearchParams(window.location.search).get("verified") === "1") {
      setJustVerified(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  if (!me) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-ink-800" />
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-ink-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {justVerified && (
        <Reveal>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {t("justVerified")}
          </div>
        </Reveal>
      )}
      <Reveal>
        <ProfileCard me={me} onSaved={(patch) => setMe({ ...me, ...patch })} />
      </Reveal>
      <Reveal delay={0.05}>
        <PasswordCard hasPassword={me.hasPassword} onChanged={() => setMe({ ...me, hasPassword: true })} />
      </Reveal>
      <Reveal delay={0.1}>
        <DangerZoneCard hasPassword={me.hasPassword} />
      </Reveal>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <HoverLift className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
      <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </HoverLift>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  );
}

function inputClass() {
  return "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-950 dark:text-paper-100 dark:placeholder:text-slate-500";
}

function ProfileCard({ me, onSaved }: { me: Me; onSaved: (patch: Partial<Me>) => void }) {
  const t = useTranslations("dashboard.settings");
  const [name, setName] = useState(me.name || "");
  const [phone, setPhone] = useState(me.phone || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error || t("errorGeneric"));
        return;
      }
      onSaved(json);
      setSuccess(t("profileUpdated"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title={t("profileTitle")} subtitle={t("profileSubtitle")}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label={t("emailAddress")}>
          <div className="flex items-center gap-2">
            <input value={me.email} disabled className={`${inputClass()} cursor-not-allowed opacity-60`} />
            {me.emailVerified ? (
              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                {t("verified")}
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                {t("unverified")}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            {me.hasGoogle ? t("signedInWithGoogle") : t("signedInWithEmail")}
            {me.hasGoogle && me.hasPassword ? t("andPassword") : ""}
          </p>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("fullName")}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("enterFullName")}
              className={inputClass()}
            />
          </Field>
          <Field label={t("phoneNumber")}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("enterPhoneNumber")}
              className={inputClass()}
            />
          </Field>
        </div>

        <AnimatedError message={error} />
        {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}

        <MotionButton
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 focus-ring"
        >
          {loading ? t("saving") : t("saveChanges")}
        </MotionButton>
      </form>
    </Card>
  );
}

function PasswordCard({ hasPassword, onChanged }: { hasPassword: boolean; onChanged: () => void }) {
  const t = useTranslations("dashboard.settings");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError(t("passwordsDontMatch"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: hasPassword ? currentPassword : undefined, newPassword }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error || t("errorGeneric"));
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(hasPassword ? t("passwordUpdated") : t("passwordSet"));
      onChanged();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      title={hasPassword ? t("changePassword") : t("setPassword")}
      subtitle={hasPassword ? t("updatePasswordSubtitle") : t("setPasswordSubtitle")}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {hasPassword && (
          <Field label={t("currentPassword")}>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t("enterCurrentPassword")}
              className={inputClass()}
            />
          </Field>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("newPassword")}>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("createStrongPassword")}
              className={inputClass()}
            />
          </Field>
          <Field label={t("confirmNewPassword")}>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("confirmYourNewPassword")}
              className={inputClass()}
            />
          </Field>
        </div>

        <AnimatedError message={error} />
        {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}

        <MotionButton
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 focus-ring"
        >
          {loading ? t("saving") : hasPassword ? t("updatePassword") : t("setPassword")}
        </MotionButton>
      </form>
    </Card>
  );
}

function DangerZoneCard({ hasPassword }: { hasPassword: boolean }) {
  const t = useTranslations("dashboard.settings");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onDelete(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: hasPassword ? password : undefined }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error || t("errorGeneric"));
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/40 p-6 dark:border-red-500/20 dark:bg-red-500/5">
      <h2 className="font-display text-lg font-700 text-red-700 dark:text-red-400">{t("dangerZone")}</h2>
      <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/70">{t("dangerZoneDesc")}</p>

      {!open ? (
        <MotionButton
          onClick={() => setOpen(true)}
          className="mt-5 rounded-xl border border-red-300 px-5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 focus-ring dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          {t("deleteAccount")}
        </MotionButton>
      ) : (
        <form onSubmit={onDelete} className="mt-5 space-y-4">
          {hasPassword && (
            <Field label={t("enterPasswordToConfirm")}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("yourPassword")}
                className={inputClass()}
              />
            </Field>
          )}
          <Field label={t("typeDeleteToConfirm")}>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className={inputClass()}
            />
          </Field>

          <AnimatedError message={error} />

          <div className="flex items-center gap-3">
            <MotionButton
              type="submit"
              disabled={loading || confirmText !== "DELETE"}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 focus-ring"
            >
              {loading ? t("deleting") : t("permanentlyDelete")}
            </MotionButton>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
                setPassword("");
                setConfirmText("");
              }}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

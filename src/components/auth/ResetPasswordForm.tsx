"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MotionButton from "../motion/MotionButton";
import AnimatedError from "../motion/AnimatedError";
import ThemeToggleButton from "../ThemeToggleButton";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token"));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (!token) {
      setError("This reset link is missing its token. Request a new one.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error || "Something went wrong");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-10 dark:bg-ink-950 lg:px-16 lg:py-12">
      <div className="flex items-center justify-end gap-4 text-sm text-slate-500 dark:text-slate-400">
        <ThemeToggleButton />
        <Link href="/login" className="font-medium text-violet-600 hover:underline dark:text-violet-300">
          Back to log in
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
        {done ? (
          <>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckIcon />
            </span>
            <h1 className="mt-4 font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
              Password updated
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Taking you to log in…
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
              Set a new password
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Choose a strong password you haven&apos;t used before.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <Field label="New Password">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-3 focus-within:border-violet-500 dark:border-ink-700">
                  <LockIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-paper-100 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  Use at least 8 characters with a mix of letters, numbers &amp; symbols.
                </p>
              </Field>

              <Field label="Confirm New Password">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-3 focus-within:border-violet-500 dark:border-ink-700">
                  <LockIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-paper-100 dark:placeholder:text-slate-500"
                  />
                </div>
              </Field>

              <AnimatedError message={error} />

              <MotionButton
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 py-3.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 focus-ring"
              >
                {loading ? "Updating…" : "Update password"}
                {!loading && <ArrowRightIcon />}
              </MotionButton>
            </form>
          </>
        )}
      </div>
    </div>
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

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0 text-slate-400">
      <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M2 10s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M2 10s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 17 17 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10.5 8 14l8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

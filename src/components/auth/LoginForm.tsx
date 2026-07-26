"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MotionButton from "../motion/MotionButton";
import AnimatedError from "../motion/AnimatedError";
import ThemeToggleButton from "../ThemeToggleButton";

const TRUST_ITEMS = [
  {
    icon: <ShieldIcon />,
    title: "Your data is 100% secure",
    body: "We never share your information.",
  },
  {
    icon: <BoltIcon />,
    title: "Instant OTPs",
    body: "Receive codes in seconds.",
  },
  {
    icon: <HeadsetIcon />,
    title: "24/7 Support",
    body: "We're always here to help.",
  },
];

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    if (oauthError) setError(oauthError);
    if (params.get("verified") === "1") setNotice("Your email is verified. You can log in now.");
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-10 dark:bg-ink-950 lg:px-16 lg:py-12">
      <div className="flex items-center justify-end gap-4 text-sm text-slate-500 dark:text-slate-400">
        <ThemeToggleButton />
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="ml-1 font-medium text-violet-600 hover:underline dark:text-violet-300">
          Sign up
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
        <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in to fund your wallet and pick up where you left off.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <Field label="Email Address">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-3 focus-within:border-violet-500 dark:border-ink-700">
              <MailIcon />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-paper-100 dark:placeholder:text-slate-500"
              />
            </div>
          </Field>

          <Field label="Password">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-3 focus-within:border-violet-500 dark:border-ink-700">
              <LockIcon />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
          </Field>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus-ring dark:border-ink-700"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="font-medium text-violet-600 hover:underline dark:text-violet-300">
              Forgot password?
            </Link>
          </div>

          <AnimatedError message={error} />
          <AnimatedError message={notice} className="text-slate-400" />

          <MotionButton
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 py-3.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 focus-ring"
          >
            {loading ? "Signing in…" : "Sign In"}
            {!loading && <ArrowRightIcon />}
          </MotionButton>

          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="h-px flex-1 bg-slate-100 dark:bg-ink-800" />
            or continue with
            <span className="h-px flex-1 bg-slate-100 dark:bg-ink-800" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href="/api/auth/google?from=login"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-ring dark:border-ink-700 dark:text-slate-300 dark:hover:bg-ink-800"
            >
              <GoogleLogo />
              Continue with Google
            </a>
            <button
              type="button"
              onClick={() => setNotice("Apple sign-in is coming soon.")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-ring dark:border-ink-700 dark:text-slate-300 dark:hover:bg-ink-800"
            >
              <AppleLogo />
              Continue with Apple
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-4 border-t border-slate-100 pt-6 dark:border-ink-800 sm:grid-cols-3">
        {TRUST_ITEMS.map((t) => (
          <div key={t.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 text-violet-500 dark:text-violet-300">{t.icon}</span>
            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.title}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t.body}</p>
            </div>
          </div>
        ))}
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

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0 text-slate-400">
      <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2.5 16 5v5c0 4-2.5 6.5-6 7.5-3.5-1-6-3.5-6-7.5V5l6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M11 2 4 12h5l-1 6 7-10h-5l1-6Z" fill="currentColor" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M4 11v-1a6 6 0 0 1 12 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="2.5" y="11" width="4" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13.5" y="11" width="4" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20">
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.32Z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.23-2.5c-.9.6-2.05.95-3.4.95-2.6 0-4.8-1.76-5.6-4.12H1.06v2.6A10 10 0 0 0 10 20Z"
      />
      <path fill="#FBBC05" d="M4.4 11.9a6 6 0 0 1 0-3.8V5.5H1.06a10 10 0 0 0 0 9l3.34-2.6Z" />
      <path
        fill="#EA4335"
        d="M10 3.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87A9.96 9.96 0 0 0 10 0a10 10 0 0 0-8.94 5.5l3.34 2.6c.8-2.36 3-4.12 5.6-4.12Z"
      />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M14.6 10.6c0-2 1.6-3 1.7-3-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.7-3.1 1.9-1.3 2.3-.3 5.7.9 7.6.6.9 1.3 2 2.3 1.9 1 0 1.3-.6 2.5-.6s1.5.6 2.5.6c1 0 1.7-.9 2.3-1.8.7-1 1-2 1-2.1-.1 0-2-0.8-2-2.9Z" />
      <path d="M12.6 4.7c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.2-.5.6-.9 1.5-.8 2.3.9.1 1.8-.4 2.3-1.1Z" />
    </svg>
  );
}

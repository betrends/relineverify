"use client";

import { useEffect, useState } from "react";

export default function VerifyEmailBanner() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setVerified(!!data.emailVerified);
        setEmail(data.email);
      });
  }, []);

  async function resend() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error || "Something went wrong");
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (verified !== false) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 bg-amber-50 px-6 py-3 text-sm dark:border-amber-500/20 dark:bg-amber-500/10">
      <p className="text-amber-800 dark:text-amber-300">
        {sent
          ? `Verification email sent to ${email}. Check your inbox.`
          : `Please verify your email (${email}) to secure your account.`}
      </p>
      <div className="flex items-center gap-3">
        {error && <span className="text-red-600 dark:text-red-400">{error}</span>}
        {!sent && (
          <button
            onClick={resend}
            disabled={loading}
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-500/30 dark:bg-transparent dark:text-amber-300 dark:hover:bg-amber-500/10"
          >
            {loading ? "Sending…" : "Resend email"}
          </button>
        )}
      </div>
    </div>
  );
}

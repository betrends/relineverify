"use client";

import { useState } from "react";

export default function BroadcastForm({ userCount, adminEmail }: { userCount: number; adminEmail: string }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState<"test" | "all" | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  async function send(target: "test" | "all") {
    setError(null);
    setResult(null);
    setSending(target);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, target }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to send");
        return;
      }
      if (json.devMode) {
        setResult(
          target === "test"
            ? "Test skipped — RESEND_API_KEY isn't set, so nothing was actually sent (check server logs)."
            : "Broadcast skipped — RESEND_API_KEY isn't set, so nothing was actually sent (check server logs)."
        );
      } else if (target === "test") {
        setResult(`Test email sent to ${adminEmail}. Check your inbox.`);
      } else {
        setResult(`Sent to ${json.sent.toLocaleString()} of ${json.total.toLocaleString()} users.`);
        setConfirming(false);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-paper-100">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. New feature: instant email verification"
          maxLength={150}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-950"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-paper-100">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your update in plain text. Leave a blank line between paragraphs."
          rows={8}
          maxLength={5000}
          className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-950"
        />
        <p className="mt-1 text-xs text-slate-400">{message.length}/5000</p>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}
      {result && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
          {result}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 dark:border-ink-800">
        <button
          type="button"
          disabled={!canSend || sending !== null}
          onClick={() => send("test")}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-ink-700 dark:text-paper-100 dark:hover:bg-ink-800"
        >
          {sending === "test" ? "Sending test…" : `Send test to ${adminEmail}`}
        </button>

        {!confirming ? (
          <button
            type="button"
            disabled={!canSend || sending !== null}
            onClick={() => setConfirming(true)}
            className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50"
          >
            Send to all {userCount.toLocaleString()} users
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 dark:border-amber-500/30 dark:bg-amber-500/10">
            <span className="text-sm text-amber-800 dark:text-amber-300">
              Really email all {userCount.toLocaleString()} users?
            </span>
            <button
              type="button"
              disabled={sending !== null}
              onClick={() => send("all")}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {sending === "all" ? "Sending…" : "Yes, send"}
            </button>
            <button
              type="button"
              disabled={sending !== null}
              onClick={() => setConfirming(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-500/10"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

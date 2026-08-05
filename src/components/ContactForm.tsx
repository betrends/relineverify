"use client";

import { useState } from "react";
import MotionButton from "./motion/MotionButton";
import AnimatedError from "./motion/AnimatedError";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not send your message");
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <p className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">Message sent</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">We'll get back to you at {email || "your email"} soon.</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 text-sm font-medium text-violet-600 hover:underline dark:text-violet-300"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus-ring focus:border-violet-500 dark:border-ink-700 dark:bg-ink-950 dark:text-paper-100"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus-ring focus:border-violet-500 dark:border-ink-700 dark:bg-ink-950 dark:text-paper-100"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus-ring focus:border-violet-500 dark:border-ink-700 dark:bg-ink-950 dark:text-paper-100"
          placeholder="How can we help?"
        />
      </div>

      <AnimatedError message={error} className="mt-3" />

      <MotionButton
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-ring"
      >
        {loading ? "Sending…" : "Send message"}
      </MotionButton>
    </form>
  );
}

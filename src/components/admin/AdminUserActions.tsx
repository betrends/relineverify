"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUserActions({
  userId,
  initialName,
  initialPhone,
  initialEmail,
}: {
  userId: string;
  initialName: string;
  initialPhone: string;
  initialEmail: string;
}) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const [amount, setAmount] = useState("");
  const [topupError, setTopupError] = useState<string | null>(null);
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupDone, setTopupDone] = useState<string | null>(null);

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    setEditError(null);
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setEditError(json.error || "Could not save changes");
        return;
      }
      setEditing(false);
      router.refresh();
    } finally {
      setEditLoading(false);
    }
  }

  async function submitTopup(e: React.FormEvent) {
    e.preventDefault();
    setTopupError(null);
    setTopupDone(null);
    const n = Number(amount);
    if (!Number.isFinite(n) || n === 0) {
      setTopupError("Enter a non-zero amount");
      return;
    }
    setTopupLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/topup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(n) }),
      });
      const json = await res.json();
      if (!res.ok) {
        setTopupError(json.error || "Could not update wallet");
        return;
      }
      setTopupDone(`New balance: ₦${json.walletBalance.toLocaleString()}`);
      setAmount("");
      router.refresh();
    } finally {
      setTopupLoading(false);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Edit profile */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-700">Edit profile</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={saveEdit} className="mt-3 space-y-3">
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-950"
              />
            </Field>
            <Field label="Phone">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-950"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none dark:border-ink-700 dark:bg-ink-950"
              />
            </Field>

            {editError && <p className="text-sm text-red-600 dark:text-red-400">{editError}</p>}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={editLoading}
                className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {editLoading ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setEditError(null);
                  setName(initialName);
                  setPhone(initialPhone);
                  setEmail(initialEmail);
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-ink-700 dark:text-slate-300 dark:hover:bg-ink-800"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-3 space-y-1.5 text-sm">
            <p><span className="text-slate-500 dark:text-slate-400">Name:</span> {initialName || "—"}</p>
            <p><span className="text-slate-500 dark:text-slate-400">Phone:</span> {initialPhone || "—"}</p>
            <p><span className="text-slate-500 dark:text-slate-400">Email:</span> {initialEmail}</p>
          </div>
        )}
      </div>

      {/* Wallet adjustment */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-ink-700 dark:bg-ink-900">
        <h2 className="font-display text-base font-700">Adjust wallet</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Positive to credit, negative to deduct. Shows in their transaction history like a normal top-up.
        </p>
        <form onSubmit={submitTopup} className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-ink-700">
            <span className="text-slate-400">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000 or -2000"
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={topupLoading}
            className="shrink-0 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {topupLoading ? "…" : "Apply"}
          </button>
        </form>
        {topupError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{topupError}</p>}
        {topupDone && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-300">{topupDone}</p>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}

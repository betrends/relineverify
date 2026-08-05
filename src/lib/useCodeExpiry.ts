import { useEffect, useState } from "react";
import { CODE_EXPIRY_MS } from "./codeExpiry";

// Real OTPs go stale fast — once a code has been sitting on screen for a
// while it's unlikely to still work, so we gray it out client-side rather
// than let someone paste a two-hour-old code and wonder why it fails.
export function useCodeExpiry(receivedAt: string | undefined, ttlMs = CODE_EXPIRY_MS) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!receivedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [receivedAt]);

  if (!receivedAt) return { expired: false, remainingMs: ttlMs };

  const expiresAt = new Date(receivedAt).getTime() + ttlMs;
  const remainingMs = Math.max(0, expiresAt - now);
  return { expired: remainingMs <= 0, remainingMs };
}

export function formatRemaining(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

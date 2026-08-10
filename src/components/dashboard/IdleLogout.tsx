"use client";

import { useEffect, useRef } from "react";

// Wallet-holding pages get a shorter timeout than a typical app — 15 min
// of no interaction anywhere.
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const CHECK_INTERVAL_MS = 15 * 1000;
const STORAGE_KEY = "reline_last_activity";
const ACTIVITY_EVENTS = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"] as const;

function readLastActivity(): number {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || Date.now();
  } catch {
    return Date.now();
  }
}

function markActive() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // localStorage unavailable (private browsing etc.) — idle tracking just
    // won't persist across tabs, each tab tracks its own activity instead.
  }
}

// No visible UI — mounted once in the dashboard layout to auto-sign-out
// after IDLE_TIMEOUT_MS with no interaction, in any tab. Shared across tabs
// via localStorage: activity in one tab resets the clock for all of them,
// so switching between tabs doesn't trigger a premature logout.
export default function IdleLogout() {
  const loggingOutRef = useRef(false);

  useEffect(() => {
    markActive();

    let lastMarked = Date.now();
    const onActivity = () => {
      const now = Date.now();
      if (now - lastMarked < 5000) return; // don't hammer localStorage on every mousemove
      lastMarked = now;
      markActive();
    };
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, onActivity, { passive: true }));

    async function doLogout() {
      if (loggingOutRef.current) return;
      loggingOutRef.current = true;
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } finally {
        window.location.href = "/login?reason=idle";
      }
    }

    const intervalId = setInterval(() => {
      if (Date.now() - readLastActivity() >= IDLE_TIMEOUT_MS) doLogout();
    }, CHECK_INTERVAL_MS);

    // Catches the case where the tab/laptop was asleep or backgrounded for
    // longer than the check interval and just woke back up.
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - readLastActivity() >= IDLE_TIMEOUT_MS) doLogout();
      else markActive();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  return null;
}

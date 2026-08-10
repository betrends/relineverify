"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "reline_install_dismissed_at";
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // don't nag again for a week

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari's own flag — not part of the standard API
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

function recentlyDismissed(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  return Date.now() - Number(raw) < DISMISS_COOLDOWN_MS;
}

export default function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    if (isIOS()) {
      // iOS gives web pages no programmatic install trigger at all — the
      // banner here can only ever be instructions, never a real button.
      const t = setTimeout(() => {
        setShowIOSInstructions(true);
        setVisible(true);
      }, 2500);
      return () => clearTimeout(t);
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  async function install() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    // Accepted or dismissed, either way the prompt is spent — Chrome won't
    // fire beforeinstallprompt again until the next eligible visit, so
    // there's nothing left for this banner to do regardless of outcome.
    if (outcome) setVisible(false);
    setDeferredEvent(null);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur dark:border-ink-700 dark:bg-ink-900/95">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="22" height="22">
            <path d="M11 3 5 12h4.2l-.8 5 6.6-9h-4.2l.8-5Z" fill="white" />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-paper-100">Install Reline</p>
          <p className={`text-xs text-slate-500 dark:text-slate-400 ${showIOSInstructions ? "" : "truncate"}`}>
            {showIOSInstructions
              ? <>Tap <ShareIcon /> then "Add to Home Screen"</>
              : "Add to home screen for faster access"}
          </p>
        </div>

        {!showIOSInstructions && (
          <>
            <button
              onClick={dismiss}
              className="shrink-0 px-2 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Later
            </button>
            <button
              onClick={install}
              className="shrink-0 rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Install
            </button>
          </>
        )}
        {showIOSInstructions && (
          <button
            onClick={dismiss}
            className="shrink-0 self-start rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Got it
          </button>
        )}
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width="13"
      height="13"
      className="mx-0.5 inline-block shrink-0 -translate-y-px text-slate-500 dark:text-slate-400"
    >
      <path
        d="M10 2.5v9M6.8 5.7 10 2.5l3.2 3.2M4.5 9v6.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

"use client";

// Full visual walkthrough for the one thing iOS won't let a website
// trigger natively: adding itself to the home screen. Shown when the
// compact install banner's "Show me how" is tapped.
export default function IOSInstallGuide({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 px-4 pb-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-ink-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-700 text-slate-900 dark:text-paper-100">Add Reline to your Home Screen</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-ink-800"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <Step number={1} label="Tap the Share icon in Safari's toolbar">
            <div className="flex items-center justify-around rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-ink-700 dark:bg-ink-950">
              <BackIcon />
              <ForwardIcon />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white">
                <span className="absolute inset-0 animate-ping rounded-xl bg-violet-400 opacity-60" />
                <ShareIcon className="relative" />
              </span>
              <TabsIcon />
              <MenuDotsIcon />
            </div>
          </Step>

          <Step number={2} label='Scroll down and tap "Add to Home Screen"'>
            <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-ink-700 dark:bg-ink-950">
              <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-slate-400 dark:text-slate-500">
                <CopyIcon />
                <span className="text-sm">Copy</span>
              </div>
              <div className="relative flex items-center gap-2.5 rounded-lg bg-violet-50 px-2.5 py-2 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30">
                <PlusSquareIcon />
                <span className="text-sm font-medium">Add to Home Screen</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-slate-400 dark:text-slate-500">
                <PrintIcon />
                <span className="text-sm">Print</span>
              </div>
            </div>
          </Step>

          <Step number={3} label='Tap "Add" in the top-right corner'>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-ink-700 dark:bg-ink-950">
              <span className="text-sm text-slate-500 dark:text-slate-400">Cancel</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add to Home Screen</span>
              <span className="rounded-md bg-violet-500 px-2.5 py-1 text-sm font-medium text-white">Add</span>
            </div>
          </Step>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function Step({ number, label, children }: { number: number; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-700 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

function ShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="17" height="17" className={className}>
      <path
        d="M10 2.5v9M6.8 5.7 10 2.5l3.2 3.2M4.5 9v6.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function PlusSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="18" height="18" className="shrink-0 text-violet-500">
      <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M10 6.5v7M6.5 10h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16" className="text-slate-400">
      <path d="M12 5 7 10l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16" className="text-slate-300 dark:text-slate-600">
      <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function TabsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16" className="text-slate-400">
      <rect x="4" y="4" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

function MenuDotsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16" className="text-slate-400">
      <circle cx="4" cy="10" r="1.3" fill="currentColor" />
      <circle cx="10" cy="10" r="1.3" fill="currentColor" />
      <circle cx="16" cy="10" r="1.3" fill="currentColor" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16">
      <rect x="6" y="6" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M4 13V5a1 1 0 0 1 1-1h8" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16">
      <rect x="5" y="7.5" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M6.5 7.5V4h7v3.5M6.5 13.5V16h7v-2.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16">
      <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

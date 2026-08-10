// Shown automatically by Next.js while a route segment (or the data it
// depends on) is still loading — e.g. slower page transitions or a Server
// Component mid-fetch. Uses the same brand mark as the favicon/PWA icon so
// it reads as "Reline is loading", not a generic spinner.
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-ink-950">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-violet-500 shadow-lg shadow-violet-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="28" height="28">
            <path d="M11 3 5 12h4.2l-.8 5 6.6-9h-4.2l.8-5Z" fill="white" />
          </svg>
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}

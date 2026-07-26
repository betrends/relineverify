"use client";

import { useEffect, useRef, useState } from "react";

const COUNTRY_CODES = [
  { flag: "🇳🇬", code: "+234", name: "Nigeria" },
  { flag: "🇺🇸", code: "+1", name: "United States" },
  { flag: "🇬🇧", code: "+44", name: "United Kingdom" },
  { flag: "🇬🇭", code: "+233", name: "Ghana" },
  { flag: "🇰🇪", code: "+254", name: "Kenya" },
  { flag: "🇿🇦", code: "+27", name: "South Africa" },
  { flag: "🇮🇳", code: "+91", name: "India" },
  { flag: "🇨🇳", code: "+86", name: "China" },
  { flag: "🇦🇪", code: "+971", name: "United Arab Emirates" },
  { flag: "🇫🇷", code: "+33", name: "France" },
  { flag: "🇩🇪", code: "+49", name: "Germany" },
  { flag: "🇨🇦", code: "+1", name: "Canada" },
];

export default function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 border-r border-slate-200 px-3 py-3 text-sm text-slate-700 focus-ring dark:border-ink-700 dark:text-paper-100"
      >
        <span>{selected.flag}</span>
        <span className="font-mono">{selected.code}</span>
        <svg
          className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-1.5 max-h-56 w-56 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-ink-700 dark:bg-ink-900">
          {COUNTRY_CODES.map((c, i) => (
            <button
              key={`${c.name}-${i}`}
              type="button"
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-ink-800"
            >
              <span>{c.flag}</span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className="font-mono text-xs text-slate-400">{c.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

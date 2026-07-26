"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ComboboxOption = {
  id: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
};

export default function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  loading = false,
  disabled = false,
  emptyMessage = "No matches",
}: {
  options: ComboboxOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  disabled?: boolean;
  emptyMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.id === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(Math.max(0, options.findIndex((o) => o.id === value)));
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  function selectOption(o: ComboboxOption) {
    if (o.disabled) return;
    onChange(o.id);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = filtered[activeIndex];
      if (o) selectOption(o);
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-900 focus-ring focus:border-violet-500 disabled:opacity-60 dark:border-ink-700 dark:bg-ink-950 dark:text-paper-100"
      >
        <span className={selected ? "" : "text-slate-400"}>
          {loading ? "Loading…" : selected ? selected.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-ink-700 dark:bg-ink-900">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full border-b border-slate-100 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-ink-800 dark:text-paper-100"
          />
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-slate-400">{emptyMessage}</p>
            ) : (
              filtered.map((o, i) => (
                <button
                  key={o.id}
                  type="button"
                  disabled={o.disabled}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => selectOption(o)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    o.id === value
                      ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
                      : i === activeIndex
                        ? "bg-slate-50 text-slate-900 dark:bg-ink-800 dark:text-paper-100"
                        : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <span>{o.label}</span>
                  {o.sublabel && (
                    <span className="ml-3 shrink-0 font-mono text-xs text-slate-400">{o.sublabel}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "./motion/Reveal";
import ServiceIcon from "./ServiceIcon";
import { slugify } from "@/lib/slugify";

type Platform = { id: string; name: string };

export default function PlatformsGrid() {
  const [platforms, setPlatforms] = useState<Platform[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/public/platforms")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setPlatforms(d.platforms || []);
      })
      .catch(() => setError("Could not load platforms"));
  }, []);

  const filtered = useMemo(() => {
    if (!platforms) return [];
    const q = query.trim().toLowerCase();
    if (!q) return platforms;
    return platforms.filter((p) => p.name.toLowerCase().includes(q));
  }, [platforms, query]);

  return (
    <>
      <Reveal>
        <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">Supported services</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Get verification codes for hundreds of platforms — here are some of the most popular.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services…"
          className="w-full max-w-sm rounded-xl border border-violet-100 bg-white/70 px-4 py-2.5 text-sm text-slate-900 shadow-sm backdrop-blur-xl focus-ring focus:border-violet-500 dark:border-white/10 dark:bg-ink-900/50 dark:text-paper-100"
        />
      </Reveal>

      <div className="mt-6">
        {error ? (
          <p className="text-sm text-danger-400">{error}</p>
        ) : !platforms ? (
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100/60 dark:bg-ink-800/60" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No services match "{query}".</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <Link
                key={p.id}
                href={`/services/${slugify(p.name)}`}
                className="flex items-center gap-3 rounded-xl border border-violet-100 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl transition-colors hover:border-violet-300 hover:bg-violet-50/60 focus-ring dark:border-white/10 dark:bg-ink-900/50 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10"
              >
                <ServiceIcon name={p.name} className="h-9 w-9" />
                <p className="truncate text-sm font-medium text-slate-900 dark:text-paper-100">{p.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

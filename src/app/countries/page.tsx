"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageBackdrop from "@/components/motion/PageBackdrop";
import Reveal from "@/components/motion/Reveal";
import { countryCodeToFlag } from "@/lib/countryFlag";
import { slugify } from "@/lib/slugify";

type Country = { id: string; name: string; code: string };

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/public/countries")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setCountries(d.countries || []);
      })
      .catch(() => setError("Could not load countries"));
  }, []);

  const filtered = useMemo(() => {
    if (!countries) return [];
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, query]);

  return (
    <div className="min-h-screen text-slate-900 dark:text-paper-100">
      <PageBackdrop />
      <SiteNav />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">Supported countries</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Numbers are available in every country listed below.</p>
        </Reveal>

        <Reveal delay={0.05} className="mt-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries…"
            className="w-full max-w-sm rounded-xl border border-violet-100 bg-white/70 px-4 py-2.5 text-sm text-slate-900 shadow-sm backdrop-blur-xl focus-ring focus:border-violet-500 dark:border-white/10 dark:bg-ink-900/50 dark:text-paper-100"
          />
        </Reveal>

        <div className="mt-6">
          {error ? (
            <p className="text-sm text-danger-400">{error}</p>
          ) : !countries ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100/60 dark:bg-ink-800/60" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No countries match "{query}".</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c, i) => (
                <Reveal key={c.id} delay={Math.min(i * 0.02, 0.3)}>
                  <Link
                    href={`/countries/${slugify(c.name)}`}
                    className="flex items-center gap-3 rounded-xl border border-violet-100 bg-white/70 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm backdrop-blur-xl transition-colors hover:border-violet-300 hover:bg-violet-50/60 focus-ring dark:border-white/10 dark:bg-ink-900/50 dark:text-paper-100 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10"
                  >
                    <span className="text-xl leading-none">{countryCodeToFlag(c.code)}</span>
                    <span className="truncate">{c.name}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageBackdrop from "@/components/motion/PageBackdrop";
import Reveal from "@/components/motion/Reveal";
import FaqAccordion from "@/components/dashboard/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — Reline",
  description: "Answers to common questions about Reline's virtual numbers, temporary emails, wallet, and delivery times.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen text-slate-900 dark:text-paper-100">
      <PageBackdrop />
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">
            Frequently asked questions
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Can't find what you're looking for?{" "}
            <Link href="/contact" className="font-medium text-violet-600 hover:underline dark:text-violet-300">
              Contact us
            </Link>
            .
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-8">
          <div className="rounded-3xl border border-violet-100 bg-white/70 p-6 shadow-[0_8px_32px_-12px_rgba(124,92,252,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/40 sm:p-8">
            <FaqAccordion />
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

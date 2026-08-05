import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PlatformsGrid from "@/components/PlatformsGrid";

export const metadata: Metadata = {
  title: "Services — Reline",
  description: "Browse the platforms Reline can verify — WhatsApp, Telegram, Instagram, and hundreds more.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-ink-950 dark:text-paper-100">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <PlatformsGrid />
      </section>

      <SiteFooter />
    </div>
  );
}

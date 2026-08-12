import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageBackdrop from "@/components/motion/PageBackdrop";
import PlatformsGrid from "@/components/PlatformsGrid";

export const metadata: Metadata = {
  title: "Services — Reline",
  description: "Browse the platforms Reline can verify — WhatsApp, Telegram, Instagram, and hundreds more.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen text-slate-900 dark:text-paper-100">
      <PageBackdrop />
      <SiteNav />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <PlatformsGrid />
      </section>

      <SiteFooter />
    </div>
  );
}

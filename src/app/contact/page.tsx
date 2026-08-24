import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/motion/Reveal";
import HoverLift from "@/components/motion/HoverLift";
import ContactForm from "@/components/ContactForm";
import { getSupportEmail, getWhatsappNumber } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact — Reline",
  description: "Get in touch with the Reline team by email, WhatsApp, or the form below.",
};

const WHATSAPP_MESSAGE = "Hi Reline, I have a question.";

export default async function ContactPage() {
  const [SUPPORT_EMAIL, WHATSAPP_NUMBER] = await Promise.all([getSupportEmail(), getWhatsappNumber()]);
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-ink-950 dark:text-paper-100">
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <h1 className="font-display text-3xl font-700 tracking-tight text-slate-900 dark:text-paper-100">Get in touch</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Questions about your wallet, an order, or something else? Reach us directly or send a message below.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Reveal delay={0.05}>
            <HoverLift className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                <MailIcon />
              </span>
              <div className="min-w-0">
                <p className="font-display font-700 text-slate-900 dark:text-paper-100">Email us</p>
                <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{SUPPORT_EMAIL}</p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:underline dark:text-violet-300"
                >
                  Send an email
                  <ArrowRightIcon />
                </a>
              </div>
            </HoverLift>
          </Reveal>

          <Reveal delay={0.1}>
            <HoverLift className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-mint-400">
                <WhatsAppIcon />
              </span>
              <div className="min-w-0">
                <p className="font-display font-700 text-slate-900 dark:text-paper-100">WhatsApp</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">+{WHATSAPP_NUMBER}</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:underline dark:text-violet-300"
                >
                  Start a chat
                  <ArrowRightIcon />
                </a>
              </div>
            </HoverLift>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-8">
          <ContactForm />
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2.5a7.5 7.5 0 0 0-6.47 11.25L2.5 17.5l3.85-1.01A7.5 7.5 0 1 0 10 2.5Zm0 1.5a6 6 0 1 1-3.06 11.15l-.22-.13-2.28.6.6-2.22-.14-.23A6 6 0 0 1 10 4Zm-2.9 2.98c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.2.87 2.35.99 2.51.12.16 1.7 2.6 4.12 3.55.58.23 1.03.36 1.38.46.58.17 1.11.15 1.53.09.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

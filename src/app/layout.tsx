import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/ThemeProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["italic"],
});

const appUrl = process.env.APP_URL || "http://localhost:3000";
const title = "Reline — Instant virtual numbers & emails for verification";
const description =
  "Rent virtual phone numbers or generate temporary email addresses for WhatsApp, Telegram and hundreds of other services. Pay in Naira, get your code in seconds.";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: appUrl,
    siteName: "Reline",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Reline",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c5cfc",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`}
    >
      <body className="font-body bg-ink-950 text-paper-100 antialiased">
        <ServiceWorkerRegister />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
            <InstallPrompt />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

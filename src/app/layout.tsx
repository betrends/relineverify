import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Reline — Instant virtual numbers for SMS verification",
  description:
    "Rent virtual phone numbers for WhatsApp, Telegram and hundreds of other services. Pay in Naira, get your code in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`}
    >
      <body className="font-body bg-ink-950 text-paper-100 antialiased">{children}</body>
    </html>
  );
}

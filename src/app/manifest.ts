import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reline — Instant virtual numbers & emails for verification",
    short_name: "Reline",
    description: "Rent virtual phone numbers and email addresses for instant SMS and email verification.",
    // Launching from the home screen should take a returning user straight
    // into the app, not the marketing site — unauthenticated visitors get
    // bounced to /login same as any direct dashboard link.
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c5cfc",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

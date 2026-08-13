import { ImageResponse } from "next/og";
import { ShareImageContent } from "@/lib/shareImage";

export const runtime = "edge";
export const alt = "Reline — Instant virtual numbers & emails for verification";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<ShareImageContent />, { ...size });
}

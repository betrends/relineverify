import { ImageResponse } from "next/og";
import { BoltMark } from "@/lib/appIcon";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS applies its own rounded-corner mask on top of this, so the artwork
// fills edge-to-edge with no border-radius of its own.
export default function AppleIcon() {
  return new ImageResponse(<BoltMark padding="18%" />, size);
}

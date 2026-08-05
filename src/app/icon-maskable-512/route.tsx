import { ImageResponse } from "next/og";
import { BoltMark } from "@/lib/appIcon";

export const runtime = "edge";

// Android can crop a maskable icon into a circle or rounded square, so the
// bolt needs extra padding to stay inside the safe zone regardless of mask.
export async function GET() {
  return new ImageResponse(<BoltMark padding="28%" />, { width: 512, height: 512 });
}

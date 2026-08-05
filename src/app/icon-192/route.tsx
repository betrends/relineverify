import { ImageResponse } from "next/og";
import { BoltMark } from "@/lib/appIcon";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(<BoltMark padding="20%" />, { width: 192, height: 192 });
}

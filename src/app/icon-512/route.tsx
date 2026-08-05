import { ImageResponse } from "next/og";
import { BoltMark } from "@/lib/appIcon";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(<BoltMark padding="20%" />, { width: 512, height: 512 });
}

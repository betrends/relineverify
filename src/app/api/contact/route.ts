import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactMessage } from "@/lib/email";
import { rateLimitOrNull } from "@/lib/rateLimit";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  message: z.string().trim().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const limited = await rateLimitOrNull(req, "contact", 5, 60 * 60 * 1000);
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all fields with a valid email" }, { status: 400 });
  }

  try {
    await sendContactMessage(parsed.data);
  } catch (err) {
    console.error("[contact] failed to send message:", err);
    return NextResponse.json({ error: "Could not send your message — please try again" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

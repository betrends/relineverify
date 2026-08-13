import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { sendBroadcastEmailBatch } from "@/lib/email";

const schema = z.object({
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(5000),
  // "test" only emails the admin sending the request, so they can see the
  // real rendered email before it goes to every user. "all" is the real send.
  target: z.enum(["test", "all"]),
});

// Resend's batch endpoint caps out at 100 emails per call.
const BATCH_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function POST(req: NextRequest) {
  const { user, response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }
  const { subject, message, target } = parsed.data;

  let recipients: string[];
  if (target === "test") {
    recipients = [user!.email];
  } else {
    const users = await prisma.user.findMany({ select: { email: true } });
    recipients = users.map((u) => u.email);
  }

  try {
    let sent = 0;
    let devMode = false;
    for (const group of chunk(recipients, BATCH_SIZE)) {
      const result = await sendBroadcastEmailBatch(group, { subject, message });
      sent += result.sent;
      devMode = result.devMode;
    }
    return NextResponse.json({ sent, total: recipients.length, devMode });
  } catch (err) {
    console.error("[admin/broadcast] send failed:", err);
    return NextResponse.json({ error: "Failed to send — check server logs" }, { status: 502 });
  }
}

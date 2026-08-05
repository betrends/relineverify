import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getSession } from "@/lib/session";
import { rateLimitOrNull } from "@/lib/rateLimit";

const schema = z.object({ password: z.string().optional() });

export async function POST(req: NextRequest) {
  const limited = await rateLimitOrNull(req, "delete-account", 10, 60 * 60 * 1000);
  if (limited) return limited;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.passwordHash) {
    if (!parsed.data.password) {
      return NextResponse.json({ error: "Enter your password to confirm" }, { status: 400 });
    }
    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Password is incorrect" }, { status: 401 });
    }
  }

  await prisma.user.delete({ where: { id: user.id } });
  clearSessionCookie();

  return NextResponse.json({ ok: true });
}

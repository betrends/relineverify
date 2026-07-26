import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      email: true,
      name: true,
      phone: true,
      avatarUrl: true,
      walletBalance: true,
      passwordHash: true,
      googleId: true,
      emailVerifiedAt: true,
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { passwordHash, googleId, emailVerifiedAt, ...rest } = user;
  return NextResponse.json({
    ...rest,
    hasPassword: !!passwordHash,
    hasGoogle: !!googleId,
    emailVerified: !!emailVerifiedAt,
  });
}

const patchSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  phone: z.string().trim().max(30).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.phone !== undefined ? { phone: parsed.data.phone } : {}),
    },
    select: { name: true, phone: true },
  });

  return NextResponse.json(user);
}

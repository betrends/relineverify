import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const schema = z.object({
  name: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  email: z.string().email().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const data: { name?: string | null; phone?: string | null; email?: string } = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name || null;
  if (parsed.data.phone !== undefined) data.phone = parsed.data.phone || null;

  if (parsed.data.email && parsed.data.email.toLowerCase() !== target.email) {
    const email = parsed.data.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== target.id) {
      return NextResponse.json({ error: "Another account already uses that email" }, { status: 409 });
    }
    data.email = email;
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, phone: true, email: true, walletBalance: true, isAdmin: true, emailVerifiedAt: true },
  });

  return NextResponse.json({ user: updated });
}

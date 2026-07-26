import { prisma } from "./prisma";
import { getSession } from "./session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true, name: true },
  });
}

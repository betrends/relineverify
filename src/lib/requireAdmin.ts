import { NextResponse } from "next/server";
import { getCurrentUser } from "./currentUser";

// Shared guard for every /api/admin/* route — same check the /admin page
// layout does, just returning a response instead of redirecting, since
// these are API routes, not pages.
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }
  if (!user.isAdmin) {
    return { user: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user, response: null };
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.APP_URL || req.nextUrl.origin;
  const from = req.nextUrl.searchParams.get("from") === "login" ? "login" : "signup";
  const ref = req.nextUrl.searchParams.get("ref")?.trim().slice(0, 20) || "";

  if (!clientId) {
    return NextResponse.redirect(
      new URL(`/${from}?error=Google+sign-in+is+not+configured+yet`, appUrl)
    );
  }

  const state = crypto.randomBytes(16).toString("hex");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", `${appUrl}/api/auth/google/callback`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(authUrl);
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10,
  };
  res.cookies.set("google_oauth_state", state, cookieOpts);
  res.cookies.set("google_oauth_from", from, cookieOpts);
  if (ref) res.cookies.set("google_oauth_ref", ref, cookieOpts);
  return res;
}

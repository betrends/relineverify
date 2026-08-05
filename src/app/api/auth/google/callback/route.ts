import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { findReferrerByCode } from "@/lib/referral";

type GoogleTokenResponse = {
  access_token: string;
  id_token: string;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

export async function GET(req: NextRequest) {
  const appUrl = process.env.APP_URL || req.nextUrl.origin;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get("google_oauth_state")?.value;
  const from = req.cookies.get("google_oauth_from")?.value === "login" ? "login" : "signup";

  const fail = (message: string) =>
    NextResponse.redirect(new URL(`/${from}?error=${encodeURIComponent(message)}`, appUrl));

  if (!clientId || !clientSecret) return fail("Google sign-in is not configured yet");
  if (!code || !state || !expectedState || state !== expectedState) {
    return fail("Google sign-in failed. Please try again.");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${appUrl}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return fail("Google sign-in failed. Please try again.");
  const tokens = (await tokenRes.json()) as GoogleTokenResponse;

  const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!userInfoRes.ok) return fail("Google sign-in failed. Please try again.");
  const googleUser = (await userInfoRes.json()) as GoogleUserInfo;

  if (!googleUser.email || !googleUser.email_verified) {
    return fail("Your Google account has no verified email");
  }
  const email = googleUser.email.toLowerCase().trim();

  let user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    if (!user.googleId || !user.emailVerifiedAt) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.sub,
          avatarUrl: googleUser.picture || user.avatarUrl,
          emailVerifiedAt: user.emailVerifiedAt || new Date(),
        },
      });
    }
  } else {
    const refCookie = req.cookies.get("google_oauth_ref")?.value;
    const referrer = refCookie ? await findReferrerByCode(refCookie) : null;

    user = await prisma.user.create({
      data: {
        email,
        name: googleUser.name || null,
        googleId: googleUser.sub,
        avatarUrl: googleUser.picture || null,
        walletBalance: 0,
        // Google already verified this address for us.
        emailVerifiedAt: new Date(),
        referredById: referrer?.id,
      },
    });
  }

  const token = await createSessionToken({ userId: user.id, email: user.email });
  await setSessionCookie(token);

  const res = NextResponse.redirect(new URL("/dashboard", appUrl));
  res.cookies.set("google_oauth_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("google_oauth_from", "", { path: "/", maxAge: 0 });
  res.cookies.set("google_oauth_ref", "", { path: "/", maxAge: 0 });
  return res;
}

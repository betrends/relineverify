import crypto from "crypto";

/**
 * Client for mail.tm — a free public temporary-inbox API. This is a
 * stand-in provider: no commercial SLA, and some big mail providers
 * filter known temp-mail domains, so delivery isn't guaranteed. Swap
 * this module for a commercial provider (e.g. MailSlurp) later without
 * touching the routes that call it — same pattern as lib/korapay.ts.
 */

const BASE_URL = "https://api.mail.tm";

export class TempMailError extends Error {}

// Thrown when the provider rejects the inbox's credentials outright (account
// deleted/disabled) — distinct from a transient network/5xx failure, so
// callers can stop polling and close it out immediately instead of waiting.
export class TempMailAuthError extends TempMailError {}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr;
}

async function pickDomain(): Promise<string> {
  const res = await fetch(`${BASE_URL}/domains`, { cache: "no-store" });
  if (!res.ok) throw new TempMailError("Could not reach the email provider");
  const json = await res.json();
  const domain = json?.["hydra:member"]?.[0]?.domain;
  if (!domain) throw new TempMailError("No email domains available right now");
  return domain;
}

export async function createInbox(): Promise<{ address: string; password: string }> {
  return withRetry(async () => {
    const domain = await pickDomain();
    // No dot in the local part: mail.tm silently strips dots server-side,
    // so an address we construct with one never matches what actually gets
    // registered — every later auth call 401s against an inbox that "exists"
    // but under a different address than the one we're using.
    const local = crypto.randomBytes(8).toString("hex");
    const address = `reline${local}@${domain}`;
    const password = crypto.randomBytes(16).toString("hex");

    const res = await fetch(`${BASE_URL}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password }),
    });
    if (!res.ok) throw new TempMailError("Could not generate an email address");
    const created = await res.json();

    // Trust whatever address the provider actually confirmed, in case of
    // further normalization beyond dot-stripping.
    return { address: created.address || address, password };
  });
}

// mail.tm tokens are valid well beyond our polling window — fetching a new
// one on every poll (every few seconds, for up to an hour) hammers their
// auth endpoint and reads as abuse, which is what gets accounts frozen.
// Cache per-address and only refresh when actually stale or rejected.
const TOKEN_TTL_MS = 5 * 60 * 1000;
const tokenCache = new Map<string, { token: string; fetchedAt: number }>();

async function getToken(address: string, password: string, forceRefresh = false): Promise<string> {
  const cached = tokenCache.get(address);
  if (!forceRefresh && cached && Date.now() - cached.fetchedAt < TOKEN_TTL_MS) {
    return cached.token;
  }

  const res = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, password }),
  });
  if (!res.ok) {
    tokenCache.delete(address);
    if (res.status === 401) throw new TempMailAuthError("This inbox is no longer available");
    throw new TempMailError("Could not access this inbox");
  }
  const json = await res.json();
  tokenCache.set(address, { token: json.token, fetchedAt: Date.now() });
  return json.token as string;
}

export async function checkInbox(
  address: string,
  password: string
): Promise<{ received: false } | { received: true; subject: string; text: string }> {
  let token = await getToken(address, password);

  let listRes = await fetch(`${BASE_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (listRes.status === 401) {
    // Cached token went stale mid-window — refresh once and retry.
    token = await getToken(address, password, true);
    listRes = await fetch(`${BASE_URL}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  }
  if (!listRes.ok) throw new TempMailError("Could not check this inbox");
  const list = await listRes.json();
  const first = list?.["hydra:member"]?.[0];
  if (!first) return { received: false };

  const msgRes = await fetch(`${BASE_URL}/messages/${first.id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!msgRes.ok) return { received: false };
  const msg = await msgRes.json();

  return {
    received: true,
    subject: msg.subject || "",
    text: msg.text || msg.intro || "",
  };
}

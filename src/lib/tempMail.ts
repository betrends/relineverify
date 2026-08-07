/**
 * Client for Guerrilla Mail — a free, public, unauthenticated temp-inbox
 * API. Third provider tried here: mail.tm started 500ing specifically for
 * requests from Vercel's servers (likely cloud-IP blocking), and MailSlurp
 * (a commercial provider, chosen to sidestep that class of problem) turned
 * out to be unreachable for this account/region regardless of device,
 * browser, or network — so its signup could never be completed to get an
 * API key. Guerrilla Mail needs no key at all, so that failure mode
 * doesn't apply, but being free and public it carries the same
 * cloud-IP-blocking risk mail.tm had — this was verified reachable from a
 * plain server-side fetch before shipping.
 *
 * Session identity: their docs say to track the session via the
 * PHPSESSID cookie, but that didn't actually work in testing (an inbox
 * created in one request came back empty when checked with that cookie
 * in a later request). Their JSON responses also include a `sid_token`
 * field that works as a query param on every subsequent call — that's
 * what's used here, stored in the `providerInboxId` column.
 *
 * Docs: https://www.guerrillamail.com/GuerrillaMailAPI.html
 */

const BASE_URL = "https://api.guerrillamail.com/ajax.php";

export class TempMailError extends Error {}

// Thrown when the provider rejects the inbox outright — distinct from a
// transient network/5xx failure, so callers can stop polling and close it
// out immediately instead of waiting.
export class TempMailAuthError extends TempMailError {}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (err instanceof TempMailAuthError) throw err; // not retryable
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function createInbox(): Promise<{ address: string; inboxId: string }> {
  return withRetry(async () => {
    let res: Response;
    try {
      res = await fetch(`${BASE_URL}?f=get_email_address`, { cache: "no-store" });
    } catch (err) {
      console.error("[tempMail] network error creating inbox:", err);
      throw new TempMailError("Could not reach the email provider");
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[tempMail] get_email_address returned ${res.status}: ${body.slice(0, 300)}`);
      throw new TempMailError("Could not reach the email provider");
    }
    const json = await res.json().catch(() => null);
    const address = json?.email_addr as string | undefined;
    const sidToken = json?.sid_token as string | undefined;
    if (!sidToken || !address) {
      console.error("[tempMail] get_email_address missing sid_token or address:", JSON.stringify(json));
      throw new TempMailError("Could not generate an email address");
    }
    return { address, inboxId: sidToken };
  });
}

export async function checkInbox(
  address: string,
  inboxId: string
): Promise<{ received: false } | { received: true; subject: string; text: string }> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}?f=check_email&seq=0&sid_token=${encodeURIComponent(inboxId)}`, {
      cache: "no-store",
    });
  } catch (err) {
    console.error("[tempMail] network error checking inbox:", err);
    throw new TempMailError("Could not check this inbox");
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[tempMail] check_email returned ${res.status}: ${body.slice(0, 300)}`);
    return { received: false };
  }

  const json = await res.json().catch(() => null);
  if (json?.auth?.success === false) {
    throw new TempMailAuthError("This inbox is no longer available");
  }

  const list = json?.list as Array<{ mail_id: number | string; mail_subject?: string; mail_excerpt?: string }> | undefined;
  if (!list || list.length === 0) return { received: false };

  // Guerrilla Mail's own auto-generated "Welcome" message (mail_id 1) is
  // present in every fresh inbox — it's not a real verification code, so
  // skip it and only report a genuine incoming message.
  const real = list.find((m) => String(m.mail_id) !== "1") ?? null;
  if (!real) return { received: false };

  // The list endpoint only gives an excerpt — fetch the full message for
  // the actual body (needed to extract a full OTP code reliably).
  let text = real.mail_excerpt || "";
  try {
    const detailRes = await fetch(
      `${BASE_URL}?f=fetch_email&email_id=${encodeURIComponent(real.mail_id)}&sid_token=${encodeURIComponent(inboxId)}`,
      { cache: "no-store" }
    );
    if (detailRes.ok) {
      const detail = await detailRes.json().catch(() => null);
      if (detail?.mail_body) text = detail.mail_body as string;
    }
  } catch {
    // Fall back to the excerpt already captured above.
  }

  return { received: true, subject: real.mail_subject || "", text };
}

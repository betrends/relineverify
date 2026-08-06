// A handful of disposable/throwaway email domains people use to dodge
// verification entirely. Not exhaustive — just blocks the most common ones.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "yopmail.com",
  "throwawaymail.com",
  "trashmail.com",
  "getnada.com",
  "dispostable.com",
]);

/**
 * Confirms the email's domain can actually receive mail (has MX records,
 * falling back to an A record per RFC 5321) and isn't a known
 * disposable-email domain. This is a lightweight existence check — it
 * doesn't verify the specific mailbox, just that mail sent there wouldn't
 * immediately bounce.
 *
 * Uses DNS-over-HTTPS (a plain fetch) rather than Node's `dns` module:
 * raw UDP DNS queries are unreliable/blocked in some serverless and
 * sandboxed environments, while HTTPS egress is always available — same
 * reason the rest of this app talks to external APIs over fetch.
 */
export async function isDeliverableEmailDomain(email: string): Promise<boolean> {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return false;

  const hasMx = await dohHasRecords(domain, "MX");
  if (hasMx === true) return true;
  if (hasMx === false) {
    // No MX — a domain can still legally receive mail via a bare A/AAAA
    // record (RFC 5321 §5.1), so check that before giving up.
    const hasA = await dohHasRecords(domain, "A");
    if (hasA !== null) return hasA;
  }

  // The lookup itself failed (network hiccup, DoH resolver down, timeout)
  // rather than confirming "no records" — don't block a real signup over
  // our own infrastructure trouble.
  return true;
}

/**
 * Returns true/false when the resolver gave a definitive answer, or null
 * if the lookup itself failed (distinct from "resolved with zero records").
 */
async function dohHasRecords(domain: string, type: "MX" | "A"): Promise<boolean | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`,
      { signal: controller.signal, headers: { Accept: "application/dns-json" } }
    ).finally(() => clearTimeout(timeout));

    if (!res.ok) return null;
    const json = await res.json();
    // Status 0 = NOERROR. A non-zero Status (e.g. 3 = NXDOMAIN) means the
    // domain itself doesn't exist — that's a definitive "no".
    if (json.Status !== 0) return false;
    return Array.isArray(json.Answer) && json.Answer.length > 0;
  } catch {
    return null;
  }
}

import { NextRequest, NextResponse } from "next/server";

/**
 * In-memory fixed-window rate limiter. Good enough for a single-instance
 * deployment; state resets on redeploy and isn't shared across instances.
 * Swap for Upstash Redis (or similar) once running more than one instance.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

// Prevent unbounded growth from one-off keys (e.g. drive-by IPs hitting a
// single route once).
const MAX_BUCKETS = 20_000;

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    if (buckets.size >= MAX_BUCKETS) buckets.clear();
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Convenience wrapper for route handlers: checks the limit for
 * `${routeName}:${ip}` and returns a 429 NextResponse if exceeded, or null
 * if the request should proceed.
 */
export function rateLimitOrNull(
  req: NextRequest,
  routeName: string,
  limit: number,
  windowMs: number
) {
  const ip = getClientIp(req);
  const { allowed, retryAfterSeconds } = checkRateLimit(`${routeName}:${ip}`, limit, windowMs);
  if (allowed) return null;

  return NextResponse.json(
    { error: "Too many attempts. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}

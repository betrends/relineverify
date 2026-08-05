import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Rate limiter with two backends:
 *
 * - Upstash Redis, used automatically when UPSTASH_REDIS_REST_URL and
 *   UPSTASH_REDIS_REST_TOKEN are set — shared across all instances, survives
 *   redeploys. This is what production should run on.
 * - An in-memory fixed-window fallback, used when those env vars are
 *   missing (e.g. local dev). Good enough for a single instance; state
 *   resets on redeploy and isn't shared across instances.
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Ratelimit instances are tied to a fixed (limit, window) pair at
// construction time, so cache one per distinct pair rather than building a
// new one on every request.
const ratelimiters = new Map<string, Ratelimit>();
function getRatelimiter(limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  let limiter = ratelimiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.fixedWindow(limit, `${windowMs} ms`),
      analytics: false,
      prefix: "reline-ratelimit",
    });
    ratelimiters.set(cacheKey, limiter);
  }
  return limiter;
}

// --- In-memory fallback ---
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

function checkRateLimitInMemory(
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

export function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  if (!redis) return checkRateLimitInMemory(key, limit, windowMs);

  const result = await getRatelimiter(limit, windowMs).limit(key);
  if (result.success) return { allowed: true, retryAfterSeconds: 0 };
  return { allowed: false, retryAfterSeconds: Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)) };
}

/**
 * Convenience wrapper for route handlers: checks the limit for
 * `${routeName}:${ip}` and returns a 429 NextResponse if exceeded, or null
 * if the request should proceed.
 */
export async function rateLimitOrNull(
  req: NextRequest,
  routeName: string,
  limit: number,
  windowMs: number
) {
  const ip = getClientIp(req);
  const { allowed, retryAfterSeconds } = await checkRateLimit(`${routeName}:${ip}`, limit, windowMs);
  if (allowed) return null;

  return NextResponse.json(
    { error: "Too many attempts. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}

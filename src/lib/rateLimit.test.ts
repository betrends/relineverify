import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rateLimit";

// No UPSTASH_REDIS_REST_URL/TOKEN in the test environment, so these exercise
// the in-memory fallback path.
describe("checkRateLimit (in-memory fallback)", () => {
  it("allows requests under the limit", async () => {
    const key = `test-under-${Date.now()}-${Math.random()}`;
    const result = await checkRateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(true);
  });

  it("allows exactly `limit` requests, then blocks the next one", async () => {
    const key = `test-limit-${Date.now()}-${Math.random()}`;
    const results = [];
    for (let i = 0; i < 4; i++) {
      results.push(await checkRateLimit(key, 3, 60_000));
    }
    expect(results.slice(0, 3).every((r) => r.allowed)).toBe(true);
    expect(results[3].allowed).toBe(false);
  });

  it("reports a positive retryAfterSeconds once blocked", async () => {
    const key = `test-retry-${Date.now()}-${Math.random()}`;
    await checkRateLimit(key, 1, 60_000);
    const blocked = await checkRateLimit(key, 1, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks distinct keys independently", async () => {
    const keyA = `test-a-${Date.now()}-${Math.random()}`;
    const keyB = `test-b-${Date.now()}-${Math.random()}`;
    await checkRateLimit(keyA, 1, 60_000);
    const blockedA = await checkRateLimit(keyA, 1, 60_000);
    const allowedB = await checkRateLimit(keyB, 1, 60_000);
    expect(blockedA.allowed).toBe(false);
    expect(allowedB.allowed).toBe(true);
  });
});

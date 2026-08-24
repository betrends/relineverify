import { describe, it, expect } from "vitest";
import { calculateReward } from "./referral";

// calculateReferralReward/getReferralPercent are thin async wrappers that
// read the percentage from the database (see siteSettings.ts,
// admin-editable via /admin/settings) — not unit-tested directly to avoid
// hitting a real database in tests. The pure calculation lives here.
describe("calculateReward", () => {
  it("calculates 5% of a round top-up amount", () => {
    expect(calculateReward(10_000, 5)).toBe(500);
  });

  it("rounds down to the nearest whole Naira", () => {
    // 5% of 999 is 49.95 -> should floor to 49, never round up money we owe
    expect(calculateReward(999, 5)).toBe(49);
  });

  it("returns 0 for a top-up too small to earn a reward", () => {
    // 5% of 10 is 0.5 -> floors to 0
    expect(calculateReward(10, 5)).toBe(0);
  });

  it("returns 0 for a zero top-up", () => {
    expect(calculateReward(0, 5)).toBe(0);
  });
});

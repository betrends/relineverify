import { describe, it, expect } from "vitest";
import { calculateReferralReward, REFERRAL_PERCENT } from "./referral";

describe("calculateReferralReward", () => {
  it("is currently configured at 5%", () => {
    expect(REFERRAL_PERCENT).toBe(5);
  });

  it("calculates 5% of a round top-up amount", () => {
    expect(calculateReferralReward(10_000)).toBe(500);
  });

  it("rounds down to the nearest whole Naira", () => {
    // 5% of 999 is 49.95 -> should floor to 49, never round up money we owe
    expect(calculateReferralReward(999)).toBe(49);
  });

  it("returns 0 for a top-up too small to earn a reward", () => {
    // 5% of 10 is 0.5 -> floors to 0
    expect(calculateReferralReward(10)).toBe(0);
  });

  it("returns 0 for a zero top-up", () => {
    expect(calculateReferralReward(0)).toBe(0);
  });
});

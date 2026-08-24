import { describe, it, expect } from "vitest";
import { parseMarkupPercent, calculateMarkedUpPrice } from "./pricing";

// getMarkupPercent/applyMarkup are thin async wrappers that read the
// markup from the database (see siteSettings.ts, admin-editable via
// /admin/settings) — not unit-tested directly to avoid hitting a real
// database in tests. Their pure logic lives here and is fully covered.
describe("parseMarkupPercent", () => {
  it("defaults to 30 when unset", () => {
    expect(parseMarkupPercent(undefined)).toBe(30);
  });

  it("reads a configured percentage", () => {
    expect(parseMarkupPercent("25")).toBe(25);
  });

  it("falls back to 30 for a negative value", () => {
    expect(parseMarkupPercent("-10")).toBe(30);
  });

  it("falls back to 30 for a non-numeric value", () => {
    expect(parseMarkupPercent("not-a-number")).toBe(30);
  });

  it("allows a zero markup", () => {
    expect(parseMarkupPercent("0")).toBe(0);
  });
});

describe("calculateMarkedUpPrice", () => {
  it("applies the configured percentage on top of the base cost", () => {
    expect(calculateMarkedUpPrice(100, 30)).toBe(130);
  });

  it("rounds up to the nearest whole Naira", () => {
    // 133 * 1.3 = 172.9 -> should round up to 173
    expect(calculateMarkedUpPrice(133, 30)).toBe(173);
  });

  it("never charges less than the base cost when markup is 0", () => {
    expect(calculateMarkedUpPrice(100, 0)).toBe(100);
  });
});

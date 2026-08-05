import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { applyMarkup, getMarkupPercent } from "./pricing";

describe("pricing", () => {
  const originalEnv = process.env.MARKUP_PERCENT;

  afterEach(() => {
    process.env.MARKUP_PERCENT = originalEnv;
  });

  describe("getMarkupPercent", () => {
    it("defaults to 30 when MARKUP_PERCENT is unset", () => {
      delete process.env.MARKUP_PERCENT;
      expect(getMarkupPercent()).toBe(30);
    });

    it("reads a configured percentage", () => {
      process.env.MARKUP_PERCENT = "25";
      expect(getMarkupPercent()).toBe(25);
    });

    it("falls back to 30 for a negative value", () => {
      process.env.MARKUP_PERCENT = "-10";
      expect(getMarkupPercent()).toBe(30);
    });

    it("falls back to 30 for a non-numeric value", () => {
      process.env.MARKUP_PERCENT = "not-a-number";
      expect(getMarkupPercent()).toBe(30);
    });

    it("allows a zero markup", () => {
      process.env.MARKUP_PERCENT = "0";
      expect(getMarkupPercent()).toBe(0);
    });
  });

  describe("applyMarkup", () => {
    beforeEach(() => {
      process.env.MARKUP_PERCENT = "30";
    });

    it("applies the configured percentage on top of the base cost", () => {
      expect(applyMarkup(100)).toBe(130);
    });

    it("rounds up to the nearest whole Naira", () => {
      // 133 * 1.3 = 172.9 -> should round up to 173
      expect(applyMarkup(133)).toBe(173);
    });

    it("never charges less than the base cost when markup is 0", () => {
      process.env.MARKUP_PERCENT = "0";
      expect(applyMarkup(100)).toBe(100);
    });
  });
});

import { describe, it, expect } from "vitest";
import { countryCodeToFlag } from "./countryFlag";

describe("countryCodeToFlag", () => {
  it("converts a lowercase code to its flag emoji", () => {
    expect(countryCodeToFlag("us")).toBe("🇺🇸");
  });

  it("converts an uppercase code to its flag emoji", () => {
    expect(countryCodeToFlag("GB")).toBe("🇬🇧");
  });

  it("converts a mixed-case code to its flag emoji", () => {
    expect(countryCodeToFlag("Ng")).toBe("🇳🇬");
  });

  it("falls back to a globe for an empty code", () => {
    expect(countryCodeToFlag("")).toBe("🌐");
  });

  it("falls back to a globe for a code that isn't 2 characters", () => {
    expect(countryCodeToFlag("usa")).toBe("🌐");
    expect(countryCodeToFlag("u")).toBe("🌐");
  });
});

import { describe, it, expect } from "vitest";
import { extractCode } from "./extractCode";

describe("extractCode", () => {
  it("extracts a plain digit sequence", () => {
    expect(extractCode("Your code is 482913")).toBe("482913");
  });

  it("strips spaces inside the code", () => {
    expect(extractCode("Your WhatsApp code is 482 913")).toBe("482913");
  });

  it("strips dashes inside the code", () => {
    expect(extractCode("Verification code: 482-913")).toBe("482913");
  });

  it("returns null when there's no code-like sequence", () => {
    expect(extractCode("Welcome to the service, no code here")).toBeNull();
  });

  it("returns null for null input", () => {
    expect(extractCode(null)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(extractCode("")).toBeNull();
  });

  it("ignores a lone digit that isn't part of a longer run", () => {
    expect(extractCode("Item 5 in your cart")).toBeNull();
  });

  it("picks the first match when multiple candidates exist", () => {
    expect(extractCode("Order #12345 code 678901")).toBe("12345");
  });

  it("finds a code inside HTML-formatted email bodies", () => {
    expect(
      extractCode(
        '<table border="0" cellspacing="0"><tr><td style="font-family:Helvetica">Your code is <b>482913</b></td></tr></table>'
      )
    ).toBe("482913");
  });

  it("returns null for HTML noise with no code, not the raw markup", () => {
    expect(
      extractCode(
        '<table border="0" cellspacing="0" cellpadding="0" align="center" style="border-collapse:collapse;"><tr><td style="font-family:Helvetica Neue"></td></tr></table>'
      )
    ).toBeNull();
  });

  it("strips HTML entities before searching", () => {
    expect(extractCode("Code:&nbsp;482913&nbsp;&mdash; expires soon")).toBe("482913");
  });
});

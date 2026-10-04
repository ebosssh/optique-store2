import { describe, expect, it } from "vitest";
import { DIOPTER_OPTIONS, formatDiopter } from "./diopter";

describe("formatDiopter", () => {
  it("formats zero as plano without a sign", () => {
    expect(formatDiopter(0)).toBe("0.00");
  });

  it("formats positive values with a leading plus", () => {
    expect(formatDiopter(1.75)).toBe("+1.75");
  });

  it("formats negative values with a leading minus", () => {
    expect(formatDiopter(-2.25)).toBe("-2.25");
  });

  it("rounds to two decimal places", () => {
    expect(formatDiopter(-2.249)).toBe("-2.25");
  });
});

describe("DIOPTER_OPTIONS", () => {
  it("spans -10.00 to +6.00 in quarter-diopter steps with no duplicates", () => {
    expect(DIOPTER_OPTIONS[0]).toBe("-10.00");
    expect(DIOPTER_OPTIONS.at(-1)).toBe("+6.00");
    expect(DIOPTER_OPTIONS).toContain("0.00");
    expect(new Set(DIOPTER_OPTIONS).size).toBe(DIOPTER_OPTIONS.length);
  });
});

import { describe, expect, it } from "vitest";
import { AXIS_OPTIONS, CYLINDER_OPTIONS } from "./toric";

describe("CYLINDER_OPTIONS", () => {
  it("spans -0.75 to -4.00 in quarter-diopter steps, always negative", () => {
    expect(CYLINDER_OPTIONS[0]).toBe("-0.75");
    expect(CYLINDER_OPTIONS.at(-1)).toBe("-4.00");
    expect(CYLINDER_OPTIONS.every((v) => v.startsWith("-"))).toBe(true);
    expect(new Set(CYLINDER_OPTIONS).size).toBe(CYLINDER_OPTIONS.length);
  });
});

describe("AXIS_OPTIONS", () => {
  it("spans 10 to 180 in 10-degree steps", () => {
    expect(AXIS_OPTIONS[0]).toBe("10");
    expect(AXIS_OPTIONS.at(-1)).toBe("180");
    expect(AXIS_OPTIONS).toHaveLength(18);
    expect(new Set(AXIS_OPTIONS).size).toBe(AXIS_OPTIONS.length);
  });
});

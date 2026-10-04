import { describe, expect, it } from "vitest";
import { formatPrescriptionInline, formatPrescriptionLine } from "./prescription";

describe("formatPrescriptionInline", () => {
  it("returns null without any prescription fields", () => {
    expect(formatPrescriptionInline({})).toBeNull();
  });

  it("formats a plain diopter", () => {
    expect(formatPrescriptionInline({ diopter: "-2.25" })).toBe("-2.25");
  });

  it("formats sphere/cylinder/axis, preferring it over diopter", () => {
    expect(formatPrescriptionInline({ diopter: "-2.25", sphere: "-2.00", cylinder: "-1.25", axis: "90" })).toBe(
      "SPH -2.00 CYL -1.25 AX 90°"
    );
  });
});

describe("formatPrescriptionLine", () => {
  it("returns null without any prescription fields", () => {
    expect(formatPrescriptionLine({})).toBeNull();
  });

  it("formats a plain diopter with a label", () => {
    expect(formatPrescriptionLine({ diopter: "-2.25" })).toBe("Діоптрія: -2.25");
  });

  it("formats sphere/cylinder/axis with labels", () => {
    expect(formatPrescriptionLine({ sphere: "-2.00", cylinder: "-1.25", axis: "90" })).toBe(
      "сфера -2.00, циліндр -1.25, вісь 90°"
    );
  });
});

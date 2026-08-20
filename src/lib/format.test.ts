import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("appends the hryvnia suffix", () => {
    expect(formatPrice(2390)).toBe(`${new Intl.NumberFormat("uk-UA").format(2390)} грн`);
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe(`${new Intl.NumberFormat("uk-UA").format(0)} грн`);
  });
});

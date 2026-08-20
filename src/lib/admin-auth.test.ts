import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkPassword, createSessionToken, verifySessionToken } from "./admin-auth";

describe("admin-auth", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "correct-horse";
    process.env.ADMIN_SESSION_SECRET = "test-secret-do-not-use-in-prod";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("checkPassword", () => {
    it("accepts the configured password", () => {
      expect(checkPassword("correct-horse")).toBe(true);
    });

    it("rejects a wrong password", () => {
      expect(checkPassword("wrong-guess")).toBe(false);
    });

    it("rejects when ADMIN_PASSWORD is not set", () => {
      delete process.env.ADMIN_PASSWORD;
      expect(checkPassword("correct-horse")).toBe(false);
    });
  });

  describe("session tokens", () => {
    it("verifies a token it just created", async () => {
      const token = await createSessionToken();
      expect(await verifySessionToken(token)).toBe(true);
    });

    it("rejects a missing token", async () => {
      expect(await verifySessionToken(undefined)).toBe(false);
    });

    it("rejects a malformed token", async () => {
      expect(await verifySessionToken("not-a-real-token")).toBe(false);
    });

    it("rejects a token with a tampered signature", async () => {
      const token = await createSessionToken();
      const [payload, signature] = token.split(".");
      const flippedChar = signature[0] === "0" ? "1" : "0";
      const tampered = `${payload}.${flippedChar}${signature.slice(1)}`;
      expect(await verifySessionToken(tampered)).toBe(false);
    });

    it("rejects a token signed with a different secret", async () => {
      const token = await createSessionToken();
      process.env.ADMIN_SESSION_SECRET = "a-different-secret";
      expect(await verifySessionToken(token)).toBe(false);
    });

    it("rejects an expired token", async () => {
      vi.useFakeTimers();
      const start = Date.now();
      vi.setSystemTime(start);

      const token = await createSessionToken();
      expect(await verifySessionToken(token)).toBe(true);

      vi.setSystemTime(start + 8 * 24 * 60 * 60 * 1000);
      expect(await verifySessionToken(token)).toBe(false);
    });
  });
});

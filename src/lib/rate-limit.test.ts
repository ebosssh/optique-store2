import { describe, expect, it, vi } from "vitest";
import { clearAttempts, isRateLimited, MAX_ATTEMPTS, recordFailedAttempt, WINDOW_MS } from "./rate-limit";

describe("rate-limit", () => {
  it("does not block a key with no recorded attempts", () => {
    expect(isRateLimited("fresh-key")).toBe(false);
  });

  it("blocks once a key hits MAX_ATTEMPTS failures", () => {
    const key = "blocks-at-max";
    for (let i = 0; i < MAX_ATTEMPTS - 1; i++) {
      recordFailedAttempt(key);
      expect(isRateLimited(key)).toBe(false);
    }
    recordFailedAttempt(key);
    expect(isRateLimited(key)).toBe(true);
  });

  it("unblocks after clearAttempts", () => {
    const key = "cleared-key";
    for (let i = 0; i < MAX_ATTEMPTS; i++) recordFailedAttempt(key);
    expect(isRateLimited(key)).toBe(true);

    clearAttempts(key);
    expect(isRateLimited(key)).toBe(false);
  });

  it("unblocks once the window has passed", () => {
    const key = "expires-key";
    vi.useFakeTimers();
    const start = Date.now();
    vi.setSystemTime(start);

    for (let i = 0; i < MAX_ATTEMPTS; i++) recordFailedAttempt(key);
    expect(isRateLimited(key)).toBe(true);

    vi.setSystemTime(start + WINDOW_MS + 1);
    expect(isRateLimited(key)).toBe(false);

    vi.useRealTimers();
  });
});

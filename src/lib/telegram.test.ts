import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { notifyNewOrder } from "./telegram";

const baseOrder = {
  id: "cabc12340001",
  name: "Іван Петренко",
  phone: "+380671234567",
  city: "Київ",
  address: "Відділення №12",
  comment: null,
  paymentType: "cod",
  total: 5000,
  items: [{ productName: "Оправа A", price: 2500, quantity: 2 }],
};

describe("notifyNewOrder", () => {
  beforeEach(() => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does nothing when Telegram env vars are not set", async () => {
    await notifyNewOrder(baseOrder);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("posts a formatted message to the Telegram API when configured", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "12345";
    vi.mocked(fetch).mockResolvedValue(new Response("{}", { status: 200 }));

    await notifyNewOrder(baseOrder);

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("https://api.telegram.org/bottest-token/sendMessage");
    const payload = JSON.parse(options!.body as string);
    expect(payload.chat_id).toBe("12345");
    expect(payload.text).toContain("Іван Петренко");
    expect(payload.text).toContain("Оправа A");
    expect(payload.text).toContain("5000 грн");
  });

  it("does not throw when the Telegram API call fails", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "12345";
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));

    await expect(notifyNewOrder(baseOrder)).resolves.toBeUndefined();
  });

  it("does not throw when the Telegram API responds with an error status", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "12345";
    vi.mocked(fetch).mockResolvedValue(new Response("bad request", { status: 400 }));

    await expect(notifyNewOrder(baseOrder)).resolves.toBeUndefined();
  });
});

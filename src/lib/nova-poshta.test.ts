import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getWarehouses, isNovaPoshtaConfigured, searchCities } from "./nova-poshta";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("nova-poshta", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.NOVA_POSHTA_API_KEY;
  });

  describe("isNovaPoshtaConfigured", () => {
    it("is false without an API key", () => {
      delete process.env.NOVA_POSHTA_API_KEY;
      expect(isNovaPoshtaConfigured()).toBe(false);
    });

    it("is true with an API key", () => {
      process.env.NOVA_POSHTA_API_KEY = "test-key";
      expect(isNovaPoshtaConfigured()).toBe(true);
    });
  });

  describe("searchCities", () => {
    beforeEach(() => {
      process.env.NOVA_POSHTA_API_KEY = "test-key";
    });

    it("returns an empty array for a blank query without calling the API", async () => {
      const results = await searchCities("  ");
      expect(results).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("maps settlement search results to ref/name pairs", async () => {
      vi.mocked(fetch).mockResolvedValue(
        jsonResponse({
          success: true,
          data: [{ Addresses: [{ Present: "м. Київ, Київська обл.", DeliveryCity: "ref-kyiv" }] }],
        })
      );

      const results = await searchCities("Киї");

      expect(results).toEqual([{ ref: "ref-kyiv", name: "м. Київ, Київська обл." }]);
      const [url, options] = vi.mocked(fetch).mock.calls[0];
      expect(url).toBe("https://api.novaposhta.ua/v2.0/json/");
      const body = JSON.parse(options!.body as string);
      expect(body.apiKey).toBe("test-key");
      expect(body.calledMethod).toBe("searchSettlements");
    });

    it("throws when the Nova Poshta API reports failure", async () => {
      vi.mocked(fetch).mockResolvedValue(jsonResponse({ success: false, errors: ["Invalid key"] }));
      await expect(searchCities("Київ")).rejects.toThrow("Invalid key");
    });
  });

  describe("getWarehouses", () => {
    beforeEach(() => {
      process.env.NOVA_POSHTA_API_KEY = "test-key";
    });

    it("returns an empty array without a city ref", async () => {
      const results = await getWarehouses("");
      expect(results).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("maps warehouse results to ref/name pairs and forwards the search string", async () => {
      vi.mocked(fetch).mockResolvedValue(
        jsonResponse({ success: true, data: [{ Ref: "ref-1", Description: "Відділення №1: вул. Хрещатик, 22" }] })
      );

      const results = await getWarehouses("ref-kyiv", "Хрещатик");

      expect(results).toEqual([{ ref: "ref-1", name: "Відділення №1: вул. Хрещатик, 22" }]);
      const [, options] = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(options!.body as string);
      expect(body.methodProperties.CityRef).toBe("ref-kyiv");
      expect(body.methodProperties.FindByString).toBe("Хрещатик");
    });
  });
});

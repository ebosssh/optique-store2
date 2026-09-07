import { beforeEach, describe, expect, it, vi } from "vitest";

const { isNovaPoshtaConfigured, searchCities } = vi.hoisted(() => ({
  isNovaPoshtaConfigured: vi.fn(),
  searchCities: vi.fn(),
}));

vi.mock("@/lib/nova-poshta", () => ({ isNovaPoshtaConfigured, searchCities }));

import { GET } from "./route";

describe("GET /api/nova-poshta/cities", () => {
  beforeEach(() => {
    isNovaPoshtaConfigured.mockReset();
    searchCities.mockReset();
  });

  it("reports not configured without calling the Nova Poshta API", async () => {
    isNovaPoshtaConfigured.mockReturnValue(false);

    const res = await GET(new Request("http://localhost/api/nova-poshta/cities?q=Київ"));
    const data = await res.json();

    expect(data).toEqual({ configured: false, results: [] });
    expect(searchCities).not.toHaveBeenCalled();
  });

  it("returns search results when configured", async () => {
    isNovaPoshtaConfigured.mockReturnValue(true);
    searchCities.mockResolvedValue([{ ref: "ref-kyiv", name: "м. Київ" }]);

    const res = await GET(new Request("http://localhost/api/nova-poshta/cities?q=Київ"));
    const data = await res.json();

    expect(data).toEqual({ configured: true, results: [{ ref: "ref-kyiv", name: "м. Київ" }] });
    expect(searchCities).toHaveBeenCalledWith("Київ");
  });

  it("returns a 502 with an empty list when the upstream call fails", async () => {
    isNovaPoshtaConfigured.mockReturnValue(true);
    searchCities.mockRejectedValue(new Error("upstream down"));

    const res = await GET(new Request("http://localhost/api/nova-poshta/cities?q=Київ"));

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ configured: true, results: [] });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const { isNovaPoshtaConfigured, getWarehouses } = vi.hoisted(() => ({
  isNovaPoshtaConfigured: vi.fn(),
  getWarehouses: vi.fn(),
}));

vi.mock("@/lib/nova-poshta", () => ({ isNovaPoshtaConfigured, getWarehouses }));

import { GET } from "./route";

describe("GET /api/nova-poshta/warehouses", () => {
  beforeEach(() => {
    isNovaPoshtaConfigured.mockReset();
    getWarehouses.mockReset();
  });

  it("reports not configured without calling the Nova Poshta API", async () => {
    isNovaPoshtaConfigured.mockReturnValue(false);

    const res = await GET(new Request("http://localhost/api/nova-poshta/warehouses?cityRef=ref-kyiv"));
    const data = await res.json();

    expect(data).toEqual({ configured: false, results: [] });
    expect(getWarehouses).not.toHaveBeenCalled();
  });

  it("returns an empty list without a cityRef", async () => {
    isNovaPoshtaConfigured.mockReturnValue(true);

    const res = await GET(new Request("http://localhost/api/nova-poshta/warehouses"));
    const data = await res.json();

    expect(data).toEqual({ configured: true, results: [] });
    expect(getWarehouses).not.toHaveBeenCalled();
  });

  it("returns warehouse results and forwards cityRef/q", async () => {
    isNovaPoshtaConfigured.mockReturnValue(true);
    getWarehouses.mockResolvedValue([{ ref: "w1", name: "Відділення №1" }]);

    const res = await GET(new Request("http://localhost/api/nova-poshta/warehouses?cityRef=ref-kyiv&q=Хрещатик"));
    const data = await res.json();

    expect(data).toEqual({ configured: true, results: [{ ref: "w1", name: "Відділення №1" }] });
    expect(getWarehouses).toHaveBeenCalledWith("ref-kyiv", "Хрещатик");
  });

  it("returns a 502 with an empty list when the upstream call fails", async () => {
    isNovaPoshtaConfigured.mockReturnValue(true);
    getWarehouses.mockRejectedValue(new Error("upstream down"));

    const res = await GET(new Request("http://localhost/api/nova-poshta/warehouses?cityRef=ref-kyiv"));

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ configured: true, results: [] });
  });
});

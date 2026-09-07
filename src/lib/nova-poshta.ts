const API_URL = "https://api.novaposhta.ua/v2.0/json/";

export type CityOption = { ref: string; name: string };
export type WarehouseOption = { ref: string; name: string };

export function isNovaPoshtaConfigured(): boolean {
  return Boolean(process.env.NOVA_POSHTA_API_KEY);
}

async function callNovaPoshta(body: Record<string, unknown>): Promise<unknown[]> {
  const apiKey = process.env.NOVA_POSHTA_API_KEY;
  if (!apiKey) throw new Error("NOVA_POSHTA_API_KEY is not set");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, ...body }),
  });
  if (!res.ok) throw new Error(`Nova Poshta API responded with ${res.status}`);

  const data = await res.json();
  if (!data.success) throw new Error(Array.isArray(data.errors) ? data.errors.join(", ") : "Nova Poshta API request failed");
  return data.data as unknown[];
}

export async function searchCities(query: string): Promise<CityOption[]> {
  if (!query.trim()) return [];

  const data = await callNovaPoshta({
    modelName: "AddressGeneral",
    calledMethod: "searchSettlements",
    methodProperties: { CityName: query, Limit: "10" },
  });

  const addresses = (data[0] as { Addresses?: unknown[] } | undefined)?.Addresses ?? [];
  return (addresses as Array<{ Present: string; DeliveryCity: string }>).map((a) => ({
    ref: a.DeliveryCity,
    name: a.Present,
  }));
}

export async function getWarehouses(cityRef: string, query?: string): Promise<WarehouseOption[]> {
  if (!cityRef) return [];

  const data = await callNovaPoshta({
    modelName: "Address",
    calledMethod: "getWarehouses",
    methodProperties: {
      CityRef: cityRef,
      Limit: "20",
      ...(query?.trim() ? { FindByString: query.trim() } : {}),
    },
  });

  return (data as Array<{ Ref: string; Description: string }>).map((w) => ({
    ref: w.Ref,
    name: w.Description,
  }));
}

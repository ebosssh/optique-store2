import { NextResponse } from "next/server";
import { isNovaPoshtaConfigured, getWarehouses } from "@/lib/nova-poshta";

export async function GET(request: Request) {
  if (!isNovaPoshtaConfigured()) {
    return NextResponse.json({ configured: false, results: [] });
  }

  const url = new URL(request.url);
  const cityRef = url.searchParams.get("cityRef") ?? "";
  const query = url.searchParams.get("q") ?? "";

  if (!cityRef) return NextResponse.json({ configured: true, results: [] });

  try {
    const results = await getWarehouses(cityRef, query);
    return NextResponse.json({ configured: true, results });
  } catch (err) {
    console.error("Nova Poshta warehouses fetch failed:", err);
    return NextResponse.json({ configured: true, results: [] }, { status: 502 });
  }
}

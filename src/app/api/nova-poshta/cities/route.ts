import { NextResponse } from "next/server";
import { isNovaPoshtaConfigured, searchCities } from "@/lib/nova-poshta";

export async function GET(request: Request) {
  if (!isNovaPoshtaConfigured()) {
    return NextResponse.json({ configured: false, results: [] });
  }

  const query = new URL(request.url).searchParams.get("q") ?? "";

  try {
    const results = await searchCities(query);
    return NextResponse.json({ configured: true, results });
  } catch (err) {
    console.error("Nova Poshta city search failed:", err);
    return NextResponse.json({ configured: true, results: [] }, { status: 502 });
  }
}

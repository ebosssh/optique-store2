"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Option = { ref: string; name: string };

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function CityWarehousePicker({
  city,
  address,
  onCityChange,
  onAddressChange,
}: {
  city: string;
  address: string;
  onCityChange: (city: string) => void;
  onAddressChange: (address: string) => void;
}) {
  const [configured, setConfigured] = useState(true);

  const [cityQuery, setCityQuery] = useState(city);
  const [cityRef, setCityRef] = useState<string | null>(null);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [cityOpen, setCityOpen] = useState(false);

  const [warehouseQuery, setWarehouseQuery] = useState(address);
  const [warehouseOptions, setWarehouseOptions] = useState<Option[]>([]);
  const [warehouseOpen, setWarehouseOpen] = useState(false);

  const debouncedCityQuery = useDebounced(cityQuery, 300);
  const debouncedWarehouseQuery = useDebounced(warehouseQuery, 300);

  // Learn once, up front, whether the feature is even usable — independent
  // of whatever the visitor happens to type first.
  useEffect(() => {
    fetch("/api/nova-poshta/cities?q=")
      .then((r) => r.json())
      .then((data) => setConfigured(Boolean(data.configured)))
      .catch(() => setConfigured(false));
  }, []);

  useEffect(() => {
    if (!configured || !debouncedCityQuery.trim() || cityRef) return;
    let cancelled = false;
    fetch(`/api/nova-poshta/cities?q=${encodeURIComponent(debouncedCityQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.configured) setConfigured(false);
        setCityOptions(data.results ?? []);
      })
      .catch(() => {
        if (!cancelled) setCityOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [configured, debouncedCityQuery, cityRef]);

  useEffect(() => {
    if (!configured || !cityRef) return;
    let cancelled = false;
    const params = new URLSearchParams({ cityRef });
    if (debouncedWarehouseQuery.trim()) params.set("q", debouncedWarehouseQuery.trim());
    fetch(`/api/nova-poshta/warehouses?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.configured) setConfigured(false);
        setWarehouseOptions(data.results ?? []);
      })
      .catch(() => {
        if (!cancelled) setWarehouseOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [configured, cityRef, debouncedWarehouseQuery]);

  if (!configured) {
    return (
      <>
        <div>
          <Label htmlFor="city">Місто *</Label>
          <Input id="city" required className="mt-1.5" value={city} onChange={(e) => onCityChange(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="address">Відділення / адреса доставки *</Label>
          <Input id="address" required className="mt-1.5" value={address} onChange={(e) => onAddressChange(e.target.value)} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <Label htmlFor="city">Місто *</Label>
        <Input
          id="city"
          required
          autoComplete="off"
          className="mt-1.5"
          value={cityQuery}
          onChange={(e) => {
            setCityQuery(e.target.value);
            setCityOpen(true);
            setCityRef(null);
            setWarehouseQuery("");
            setWarehouseOptions([]);
            onCityChange(e.target.value);
            onAddressChange("");
          }}
          onFocus={() => setCityOpen(true)}
          onBlur={() => setTimeout(() => setCityOpen(false), 150)}
        />
        {cityOpen && cityOptions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border bg-popover shadow-md">
            {cityOptions.map((c) => (
              <li key={c.ref}>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-secondary"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setCityQuery(c.name);
                    setCityRef(c.ref);
                    setCityOpen(false);
                    setCityOptions([]);
                    onCityChange(c.name);
                  }}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative">
        <Label htmlFor="warehouse">Відділення Нової пошти *</Label>
        <Input
          id="warehouse"
          required
          autoComplete="off"
          disabled={!cityRef}
          placeholder={cityRef ? "Номер відділення або вулиця" : "Спершу оберіть місто"}
          className="mt-1.5"
          value={warehouseQuery}
          onChange={(e) => {
            setWarehouseQuery(e.target.value);
            setWarehouseOpen(true);
            onAddressChange(e.target.value);
          }}
          onFocus={() => setWarehouseOpen(true)}
          onBlur={() => setTimeout(() => setWarehouseOpen(false), 150)}
        />
        {warehouseOpen && warehouseOptions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border bg-popover shadow-md">
            {warehouseOptions.map((w) => (
              <li key={w.ref}>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-secondary"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setWarehouseQuery(w.name);
                    setWarehouseOpen(false);
                    setWarehouseOptions([]);
                    onAddressChange(w.name);
                  }}
                >
                  {w.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

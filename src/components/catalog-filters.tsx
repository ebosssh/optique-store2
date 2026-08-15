"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GENDERS = [
  { value: "all", label: "Усі" },
  { value: "чоловічі", label: "Чоловічі" },
  { value: "жіночі", label: "Жіночі" },
  { value: "унісекс", label: "Унісекс" },
  { value: "дитячі", label: "Дитячі" },
];

const SORTS = [
  { value: "default", label: "За замовчуванням" },
  { value: "price-asc", label: "Спочатку дешевші" },
  { value: "price-desc", label: "Спочатку дорожчі" },
];

export function CatalogFilters({ showGender }: { showGender: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "default") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const genderLabels = Object.fromEntries(GENDERS.map((g) => [g.value, g.label]));
  const sortLabels = Object.fromEntries(SORTS.map((s) => [s.value, s.label]));

  return (
    <div className="flex flex-wrap gap-3">
      {showGender && (
        <Select defaultValue={searchParams.get("gender") ?? "all"} onValueChange={(v) => setParam("gender", v as string)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Стать">{(value: string) => genderLabels[value] ?? "Стать"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {GENDERS.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Select defaultValue={searchParams.get("sort") ?? "default"} onValueChange={(v) => setParam("sort", v as string)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Сортування">{(value: string) => sortLabels[value] ?? "Сортування"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORTS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

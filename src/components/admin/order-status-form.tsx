"use client";

import { useState, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/app/admin/(dashboard)/actions";

const STATUSES = [
  { value: "NEW", label: "Нове" },
  { value: "CONFIRMED", label: "Підтверджено" },
  { value: "CANCELLED", label: "Скасовано" },
] as const;

export function OrderStatusForm({ orderId, status }: { orderId: string; status: string }) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();
  const labels = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]));

  return (
    <div className="flex items-center gap-3">
      <Select value={value} onValueChange={(v) => setValue(v as string)}>
        <SelectTrigger className="w-48">
          <SelectValue>{(v: string) => labels[v] ?? "Статус"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        disabled={isPending || value === status}
        onClick={() => startTransition(() => updateOrderStatus(orderId, value as "NEW" | "CONFIRMED" | "CANCELLED"))}
      >
        {isPending ? "Збереження..." : "Зберегти статус"}
      </Button>
    </div>
  );
}

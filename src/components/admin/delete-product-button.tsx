"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/admin/(dashboard)/actions";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Видалити товар «${productName}»? Цю дію не можна скасувати.`)) return;
        startTransition(() => deleteProduct(productId));
      }}
    >
      <Trash2 className="size-4" /> {isPending ? "Видалення..." : "Видалити товар"}
    </Button>
  );
}

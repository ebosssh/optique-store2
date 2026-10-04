"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { DIOPTER_OPTIONS } from "@/lib/diopter";
import type { ProductType } from "@/components/product-image";

export function AddToCartButton({
  product,
  size = "default",
  full = false,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    price: number;
    colorHex: string;
    imageEmoji: string;
    images: string[];
    type: ProductType;
  };
  size?: "sm" | "default" | "lg";
  full?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const [diopter, setDiopter] = useState("");

  const needsDiopter = product.type === "LENSES";
  const canAdd = !needsDiopter || diopter !== "";

  return (
    <div className={full ? "space-y-1.5" : "flex items-center gap-1.5"}>
      {needsDiopter && (
        <select
          required
          value={diopter}
          onChange={(e) => setDiopter(e.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="" disabled>
            Оберіть діоптрію
          </option>
          {DIOPTER_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      )}
      <Button
        size={size}
        variant={added ? "secondary" : "default"}
        className={full ? "w-full" : undefined}
        disabled={!canAdd}
        onClick={(e) => {
          e.preventDefault();
          if (!canAdd) return;
          add({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            colorHex: product.colorHex,
            imageEmoji: product.imageEmoji,
            imageUrl: product.images[0] ?? null,
            diopter: needsDiopter ? diopter : null,
          });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
      >
        {added ? (
          <>
            <Check className="size-4" /> Додано
          </>
        ) : (
          <>
            <ShoppingCart className="size-4" /> У кошик
          </>
        )}
      </Button>
    </div>
  );
}

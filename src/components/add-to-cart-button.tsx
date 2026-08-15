"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";

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
  };
  size?: "sm" | "default" | "lg";
  full?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  return (
    <Button
      size={size}
      variant={added ? "secondary" : "default"}
      className={full ? "w-full" : undefined}
      onClick={(e) => {
        e.preventDefault();
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          price: product.price,
          colorHex: product.colorHex,
          imageEmoji: product.imageEmoji,
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
  );
}

"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { DIOPTER_OPTIONS } from "@/lib/diopter";
import { AXIS_OPTIONS, CYLINDER_OPTIONS } from "@/lib/toric";
import type { ProductType } from "@/components/product-image";

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

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
    isToric: boolean;
  };
  size?: "sm" | "default" | "lg";
  full?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const [diopter, setDiopter] = useState("");
  const [sphere, setSphere] = useState("");
  const [cylinder, setCylinder] = useState("");
  const [axis, setAxis] = useState("");

  const needsDiopter = product.type === "LENSES" && !product.isToric;
  const needsToric = product.type === "LENSES" && product.isToric;
  const canAdd = (!needsDiopter || diopter !== "") && (!needsToric || (sphere !== "" && cylinder !== "" && axis !== ""));

  return (
    <div className={full ? "space-y-1.5" : "flex items-center gap-1.5"}>
      {needsDiopter && (
        <select required value={diopter} onChange={(e) => setDiopter(e.target.value)} className={selectClass}>
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
      {needsToric && (
        <div className={full ? "grid grid-cols-3 gap-1.5" : "flex items-center gap-1.5"}>
          <select required value={sphere} onChange={(e) => setSphere(e.target.value)} className={selectClass}>
            <option value="" disabled>
              Сфера
            </option>
            {DIOPTER_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select required value={cylinder} onChange={(e) => setCylinder(e.target.value)} className={selectClass}>
            <option value="" disabled>
              Циліндр
            </option>
            {CYLINDER_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select required value={axis} onChange={(e) => setAxis(e.target.value)} className={selectClass}>
            <option value="" disabled>
              Вісь
            </option>
            {AXIS_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}°
              </option>
            ))}
          </select>
        </div>
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
            sphere: needsToric ? sphere : null,
            cylinder: needsToric ? cylinder : null,
            axis: needsToric ? axis : null,
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

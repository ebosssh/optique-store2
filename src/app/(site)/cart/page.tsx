"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product-image";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, remove, setQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-bold">Кошик порожній</h1>
        <p className="text-muted-foreground">Додайте товари з каталогу, щоб оформити замовлення.</p>
        <Link href="/catalog/opravy" className={buttonVariants({ size: "lg" })}>
          До каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold">Кошик</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-xl border bg-card p-4">
              <ProductImage type="GLASSES" colorHex={item.colorHex} className="w-24 shrink-0 sm:w-28" />
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-xs uppercase text-muted-foreground">{item.brand}</span>
                <Link href={`/product/${item.slug}`} className="font-medium hover:text-primary">{item.name}</Link>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="size-8" onClick={() => setQuantity(item.productId, item.quantity - 1)}>
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button size="icon" variant="outline" className="size-8" onClick={() => setQuantity(item.productId, item.quantity + 1)}>
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <span className="text-lg font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={() => remove(item.productId)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border bg-card p-6">
          <h2 className="font-semibold">Разом до сплати</h2>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Сума</span>
            <span>{formatPrice(totalPrice())}</span>
          </div>
          <Link href="/checkout" className={buttonVariants({ size: "lg", className: "mt-6 w-full" })}>
            Оформити замовлення
          </Link>
        </div>
      </div>
    </div>
  );
}

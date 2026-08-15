"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/format";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, remove, setQuantity, totalPrice } = useCart();

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" className="relative" />}>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Кошик {items.length > 0 && `(${items.length})`}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
            <ShoppingBag className="size-10" />
            <p>Кошик порожній</p>
            <SheetClose render={<Link href="/catalog/opravy" className={buttonVariants({ variant: "secondary" })} />}>
              До каталогу
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <ProductImage type="GLASSES" colorHex={item.colorHex} className="w-20 shrink-0" />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-xs uppercase text-muted-foreground">{item.brand}</span>
                    <span className="line-clamp-2 text-sm font-medium">{item.name}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-7"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-7"
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="size-7 shrink-0" onClick={() => remove(item.productId)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Separator />
            <SheetFooter>
              <div className="flex w-full items-center justify-between text-base font-semibold">
                <span>Разом</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <SheetClose render={<Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full" })} />}>
                Оформити замовлення
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

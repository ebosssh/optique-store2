"use client";

import Link from "next/link";
import { useState } from "react";
import { Glasses, Menu, Phone, ShoppingCart, Stethoscope, Store } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart-sheet";
import { useCart } from "@/store/cart";
import { SITE } from "@/lib/format";

const NAV = [
  { href: "/catalog/opravy", label: "Оправи для зору" },
  { href: "/catalog/soncezahysni", label: "Сонцезахисні окуляри" },
  { href: "/catalog/linzy", label: "Контактні лінзи" },
  { href: "/catalog/aksesuary", label: "Аксесуари" },
  { href: "/catalog/doglyad", label: "Засоби для догляду" },
];

const mobileLinkClass = "rounded-md px-2 py-2.5 text-sm font-medium hover:bg-secondary";

export function SiteHeader() {
  const count = useCart((s) => s.totalCount());
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="hidden border-b bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <span>{SITE.hours} · {SITE.city}, {SITE.address}</span>
          <div className="flex flex-col items-end gap-1 py-1">
            <div className="flex items-center gap-4">
              <Link href="/pryjom-likarya" className={buttonVariants({ variant: "secondary", size: "xs" })}>
                <Stethoscope className="size-3.5" /> Запис до лікаря
              </Link>
              <a href={SITE.phoneHref} className="flex items-center gap-1 hover:underline">
                <Phone className="size-3.5" /> {SITE.phone}
              </a>
            </div>
            <a href={SITE.storePhoneHref} className="flex items-center gap-1 hover:underline">
              <Store className="size-3.5" /> Магазин: {SITE.storePhone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Меню</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV.map((item) => (
                <SheetClose key={item.href} render={<Link href={item.href} className={mobileLinkClass} />}>
                  {item.label}
                </SheetClose>
              ))}
              <SheetClose render={<Link href="/pryjom-likarya" className={mobileLinkClass} />}>
                Запис до лікаря
              </SheetClose>
              <SheetClose render={<Link href="/pro-nas" className={mobileLinkClass} />}>
                Про нас
              </SheetClose>
              <SheetClose render={<Link href="/kontakty" className={mobileLinkClass} />}>
                Контакти
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <Glasses className="size-6" />
          {SITE.name}
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/pryjom-likarya"
            className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}
          >
            Записатись до лікаря
          </Link>
          <CartSheet>
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </CartSheet>
        </div>
      </div>
    </header>
  );
}

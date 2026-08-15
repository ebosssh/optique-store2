"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", comment: "" });
  const [paymentType, setPaymentType] = useState<"cod" | "card">("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold">Кошик порожній</h1>
        <p className="text-muted-foreground">Додайте товари перш ніж оформити замовлення.</p>
        <Link href="/catalog/opravy" className={buttonVariants({ size: "lg" })}>
          До каталогу
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentType,
          items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Не вдалося оформити замовлення");
      }
      const data = await res.json();
      clear();
      router.push(`/checkout/success?order=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold">Оформлення замовлення</h1>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Ім&apos;я та прізвище *</Label>
              <Input id="name" required className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input id="phone" required type="tel" placeholder="+380..." className="mt-1.5" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="city">Місто *</Label>
              <Input id="city" required className="mt-1.5" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="address">Відділення / адреса доставки *</Label>
              <Input id="address" required className="mt-1.5" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="comment">Коментар до замовлення</Label>
            <Textarea id="comment" className="mt-1.5" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          </div>

          <div>
            <Label>Спосіб оплати</Label>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {[
                { value: "cod", title: "Оплата при отриманні", desc: "Готівкою або карткою кур'єру / у відділенні" },
                { value: "card", title: "Оплата на картку", desc: "Реквізити надішле менеджер після дзвінка" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setPaymentType(opt.value as "cod" | "card")}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    paymentType === opt.value ? "border-primary bg-secondary" : "hover:bg-secondary/50"
                  )}
                >
                  <div className="font-medium">{opt.title}</div>
                  <div className="text-xs text-muted-foreground">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="h-fit rounded-xl border bg-card p-6">
          <h2 className="font-semibold">Ваше замовлення</h2>
          <Separator className="my-4" />
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span className="line-clamp-1 text-muted-foreground">{i.name} × {i.quantity}</span>
                <span className="shrink-0 font-medium">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Разом</span>
            <span>{formatPrice(totalPrice())}</span>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
            {loading ? "Оформлення..." : "Підтвердити замовлення"}
          </Button>
        </div>
      </form>
    </div>
  );
}

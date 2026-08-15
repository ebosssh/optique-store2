import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice, SITE } from "@/lib/format";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <CheckCircle2 className="size-14 text-primary" />
      <h1 className="font-heading text-3xl font-bold">Дякуємо за замовлення!</h1>
      <p className="text-muted-foreground">
        Номер вашого замовлення: <span className="font-mono font-medium text-foreground">{order.id.slice(-8).toUpperCase()}</span>.
        Наш менеджер зателефонує на {order.phone} для підтвердження протягом робочого дня.
      </p>

      <div className="mt-4 w-full rounded-xl border bg-card p-6 text-left">
        <ul className="space-y-2 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span className="text-muted-foreground">{i.productName} × {i.quantity}</span>
              <span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-4 text-base font-bold">
          <span>Разом</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Питання щодо замовлення? Телефонуйте: <a href={SITE.phoneHref} className="text-primary hover:underline">{SITE.phone}</a>
      </p>

      <Link href="/" className={buttonVariants({ size: "lg" })}>
        На головну
      </Link>
    </div>
  );
}

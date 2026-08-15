import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { OrderStatusForm } from "@/components/admin/order-status-form";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Усі замовлення
      </Link>

      <h1 className="mt-3 font-heading text-2xl font-bold">
        Замовлення №{order.id.slice(-8).toUpperCase()}
      </h1>
      <p className="text-sm text-muted-foreground">
        {new Intl.DateTimeFormat("uk-UA", { dateStyle: "long", timeStyle: "short" }).format(order.createdAt)}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <div className="text-xs uppercase text-muted-foreground">Клієнт</div>
          <div className="mt-1 font-medium">{order.name}</div>
          <a href={`tel:${order.phone}`} className="text-primary hover:underline">{order.phone}</a>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-xs uppercase text-muted-foreground">Доставка</div>
          <div className="mt-1 font-medium">{order.city}</div>
          <div className="text-sm text-muted-foreground">{order.address}</div>
        </div>
      </div>

      {order.comment && (
        <div className="mt-4 rounded-xl border bg-card p-4">
          <div className="text-xs uppercase text-muted-foreground">Коментар</div>
          <div className="mt-1 text-sm">{order.comment}</div>
        </div>
      )}

      <div className="mt-4 rounded-xl border bg-card p-4">
        <div className="text-xs uppercase text-muted-foreground">Оплата</div>
        <div className="mt-1 text-sm">{order.paymentType === "cod" ? "При отриманні" : "На картку"}</div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Товари</h2>
        <ul className="mt-3 space-y-2 rounded-xl border bg-card p-4 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span className="text-muted-foreground">{i.productName} × {i.quantity}</span>
              <span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between px-1 text-base font-bold">
          <span>Разом</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Статус замовлення</h2>
        <div className="mt-3">
          <OrderStatusForm orderId={order.id} status={order.status} />
        </div>
      </div>
    </div>
  );
}

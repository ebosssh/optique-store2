import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  NEW: "Нове",
  CONFIRMED: "Підтверджено",
  CANCELLED: "Скасовано",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Замовлення ({orders.length})</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">№</th>
              <th className="p-3">Клієнт</th>
              <th className="p-3">Телефон</th>
              <th className="p-3">Товарів</th>
              <th className="p-3">Сума</th>
              <th className="p-3">Статус</th>
              <th className="p-3">Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-secondary/20">
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs text-primary hover:underline">
                    {o.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="p-3">{o.name}</td>
                <td className="p-3 text-muted-foreground">{o.phone}</td>
                <td className="p-3">{o.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                <td className="p-3 font-medium">{formatPrice(o.total)}</td>
                <td className="p-3">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{STATUS_LABELS[o.status]}</span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Intl.DateTimeFormat("uk-UA", { dateStyle: "short", timeStyle: "short" }).format(o.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-center text-muted-foreground">Замовлень ще немає.</p>}
      </div>
    </div>
  );
}

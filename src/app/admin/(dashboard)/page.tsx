import Link from "next/link";
import { Package, ShoppingBag, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [productCount, orderCount, newOrders, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "NEW" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  const recentOrders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Огляд</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/products" className="rounded-xl border bg-card p-5 hover:shadow-sm">
          <Package className="size-5 text-primary" />
          <div className="mt-2 text-2xl font-bold">{productCount}</div>
          <div className="text-sm text-muted-foreground">товарів у каталозі</div>
        </Link>
        <Link href="/admin/orders" className="rounded-xl border bg-card p-5 hover:shadow-sm">
          <ShoppingBag className="size-5 text-primary" />
          <div className="mt-2 text-2xl font-bold">{orderCount}</div>
          <div className="text-sm text-muted-foreground">
            замовлень {newOrders > 0 && <span className="text-accent-foreground">({newOrders} нових)</span>}
          </div>
        </Link>
        <div className="rounded-xl border bg-card p-5">
          <TrendingUp className="size-5 text-primary" />
          <div className="mt-2 text-2xl font-bold">{formatPrice(revenue._sum.total ?? 0)}</div>
          <div className="text-sm text-muted-foreground">сума всіх замовлень</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Останні замовлення</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">Усі замовлення</Link>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl border bg-card">
          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">Замовлень ще немає.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="p-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs text-primary hover:underline">
                        {o.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="p-3">{o.name}</td>
                    <td className="p-3 text-muted-foreground">{o.phone}</td>
                    <td className="p-3 font-medium">{formatPrice(o.total)}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

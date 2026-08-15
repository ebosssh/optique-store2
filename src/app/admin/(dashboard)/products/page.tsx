import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Товари ({products.length})</h1>
        <Link href="/admin/products/new" className={buttonVariants()}>
          <Plus className="size-4" /> Додати товар
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Назва</th>
              <th className="p-3">Категорія</th>
              <th className="p-3">Ціна</th>
              <th className="p-3">Наявність</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/20">
                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.brand}</div>
                </td>
                <td className="p-3 text-muted-foreground">{p.category.name}</td>
                <td className="p-3">
                  <span className="font-medium">{formatPrice(p.price)}</span>
                  {p.oldPrice && <span className="ml-2 text-xs text-muted-foreground line-through">{formatPrice(p.oldPrice)}</span>}
                </td>
                <td className="p-3">
                  {p.inStock ? (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">В наявності</span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Немає</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-primary hover:underline">
                    Редагувати
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-center text-muted-foreground">Товарів ще немає.</p>}
      </div>
    </div>
  );
}

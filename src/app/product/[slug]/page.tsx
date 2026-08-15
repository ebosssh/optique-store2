import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Stethoscope, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductImage } from "@/components/product-image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, CATEGORY_LABELS } from "@/lib/format";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
  });

  const meta = CATEGORY_LABELS[product.category.slug];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">Головна</Link> /{" "}
        <Link href={`/catalog/${product.category.slug}`} className="hover:text-primary">{meta?.title}</Link> /{" "}
        <span>{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative">
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
            {product.oldPrice && <Badge className="bg-accent text-accent-foreground">Знижка</Badge>}
            {product.isNew && <Badge variant="secondary">Новинка</Badge>}
          </div>
          <ProductImage type={product.type} colorHex={product.colorHex} className="border" />
        </div>

        <div>
          <span className="text-sm uppercase tracking-wide text-muted-foreground">{product.brand}</span>
          <h1 className="mt-1 font-heading text-2xl font-bold md:text-3xl">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Бренд</dt>
              <dd className="font-medium">{product.brand}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Стать</dt>
              <dd className="font-medium capitalize">{product.gender}</dd>
            </div>
            {product.packSize && (
              <div>
                <dt className="text-muted-foreground">Формат</dt>
                <dd className="font-medium">{product.packSize}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Наявність</dt>
              <dd className="font-medium">{product.inStock ? "В наявності" : "Під замовлення"}</dd>
            </div>
          </dl>

          <div className="mt-6 max-w-xs">
            <AddToCartButton product={product} size="lg" full />
          </div>

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Truck className="size-4" /> Доставка по Україні 1–3 дні</div>
            <div className="flex items-center gap-2"><ShieldCheck className="size-4" /> Офіційна гарантія</div>
            {product.type === "LENSES" && (
              <div className="flex items-center gap-2">
                <Stethoscope className="size-4" />
                Потрібна консультація лікаря?{" "}
                <Link href="/pryjom-likarya" className="text-primary hover:underline">Записатись</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-xl font-bold">Схожі товари</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

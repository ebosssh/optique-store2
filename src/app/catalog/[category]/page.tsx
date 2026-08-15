import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { CatalogFilters } from "@/components/catalog-filters";

export function generateStaticParams() {
  return Object.keys(CATEGORY_LABELS).map((category) => ({ category }));
}

export default async function CatalogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ gender?: string; sort?: string }>;
}) {
  const { category } = await params;
  const { gender, sort } = await searchParams;

  const meta = CATEGORY_LABELS[category];
  if (!meta) notFound();

  const showGender = category === "opravy" || category === "soncezahysni";

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc" ? { price: "asc" } : sort === "price-desc" ? { price: "desc" } : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where: {
      category: { slug: category },
      ...(showGender && gender ? { gender } : {}),
    },
    orderBy,
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <nav className="text-xs text-muted-foreground">
        <a href="/" className="hover:text-primary">Головна</a> / <span>{meta.title}</span>
      </nav>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">{meta.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{meta.description}</p>
        </div>
        <CatalogFilters showGender={showGender} />
      </div>

      {products.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">У цій категорії поки немає товарів за обраним фільтром.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

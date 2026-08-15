import Link from "next/link";
import type { Product } from "@prisma/client";
import { ProductImage } from "@/components/product-image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="relative block p-4">
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
          {product.oldPrice && <Badge className="bg-accent text-accent-foreground">Знижка</Badge>}
          {product.isNew && <Badge variant="secondary">Новинка</Badge>}
        </div>
        <ProductImage type={product.type} colorHex={product.colorHex} />
      </Link>
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</span>
        <Link href={`/product/${product.slug}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-medium hover:text-primary">
          {product.name}
        </Link>
        {product.packSize && <span className="text-xs text-muted-foreground">{product.packSize}</span>}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-semibold">{formatPrice(product.oldPrice ? Math.round(product.price) : product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <div className="mt-2">
          <AddToCartButton product={product} size="sm" full />
        </div>
      </div>
    </div>
  );
}

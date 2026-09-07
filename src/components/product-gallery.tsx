"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductImage, type ProductType } from "@/components/product-image";

export function ProductGallery({
  images,
  type,
  colorHex,
  className,
}: {
  images: string[];
  type: ProductType;
  colorHex: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return <ProductImage type={type} colorHex={colorHex} className={className} />;
  }

  const goTo = (next: number) => setIndex((next + images.length) % images.length);

  return (
    <div className="w-full">
      <div className={cn("relative aspect-square w-full overflow-hidden rounded-xl bg-muted", className)}>
        <Image
          src={images[index]}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover"
          priority={index === 0}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Попереднє фото"
              onClick={() => goTo(index - 1)}
              className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-sm hover:bg-background"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Наступне фото"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-sm hover:bg-background"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Фото ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn("size-1.5 rounded-full transition-colors", i === index ? "bg-primary" : "bg-muted-foreground/30")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

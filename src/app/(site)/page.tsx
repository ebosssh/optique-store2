import Link from "next/link";
import { ArrowRight, Award, Glasses, ShieldCheck, Stethoscope, Truck, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, SITE } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [sale, newArrivals] = await Promise.all([
    prisma.product.findMany({ where: { oldPrice: { not: null } }, take: 4, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { isNew: true }, take: 4, orderBy: { createdAt: "desc" } }),
  ]);

  const categories = Object.entries(CATEGORY_LABELS).map(([slug, v]) => ({ slug, ...v }));

  return (
    <div className="flex flex-col">
      <section className="border-b bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              Оптика, якій довіряють
            </span>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5xl">
              Окуляри та контактні лінзи для чіткого зору
            </h1>
            <p className="mt-4 max-w-md text-primary-foreground/85">
              Оправи, сонцезахисні окуляри, контактні лінзи та аксесуари провідних брендів. Підбір лінз з лікарем-офтальмологом.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/catalog/opravy" className={buttonVariants({ size: "lg", variant: "secondary" })}>
                Перейти до каталогу <ArrowRight className="size-4" />
              </Link>
              <Link href="/pryjom-likarya" className={buttonVariants({ size: "lg", variant: "secondary" })}>
                <Stethoscope className="size-4" /> Запис до лікаря
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <ProductImage type="SUNGLASSES" colorHex="#ffffff" className="bg-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <h2 className="font-heading text-2xl font-bold">Каталог</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center transition-shadow hover:shadow-md"
            >
              <ProductImage
                type={c.slug === "opravy" ? "GLASSES" : c.slug === "soncezahysni" ? "SUNGLASSES" : c.slug === "linzy" ? "LENSES" : c.slug === "aksesuary" ? "ACCESSORY" : "CARE"}
                colorHex="#b45309"
                className="w-20"
              />
              <span className="text-sm font-medium group-hover:text-primary">{c.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4">
          <div>
            <Award className="mx-auto size-6 text-primary" />
            <div className="mt-2 text-2xl font-bold">12+</div>
            <div className="text-sm text-muted-foreground">років на ринку</div>
          </div>
          <div>
            <Glasses className="mx-auto size-6 text-primary" />
            <div className="mt-2 text-2xl font-bold">15 000+</div>
            <div className="text-sm text-muted-foreground">виготовлених окулярів</div>
          </div>
          <div>
            <ShieldCheck className="mx-auto size-6 text-primary" />
            <div className="mt-2 text-2xl font-bold">40+</div>
            <div className="text-sm text-muted-foreground">брендів в асортименті</div>
          </div>
          <div>
            <Users className="mx-auto size-6 text-primary" />
            <div className="mt-2 text-2xl font-bold">6</div>
            <div className="text-sm text-muted-foreground">лікарів-офтальмологів</div>
          </div>
        </div>
      </section>

      {sale.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-12">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Знижки тижня</h2>
            <Link href="/catalog/opravy" className="text-sm font-medium text-primary hover:underline">
              Усі пропозиції
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sale.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-12 text-center">
          <Stethoscope className="size-8" />
          <h2 className="font-heading text-2xl font-bold">Перевірка зору та підбір окулярів</h2>
          <p className="max-w-xl text-primary-foreground/85">
            Наші лікарі-офтальмологи допоможуть підібрати окуляри чи контактні лінзи відповідно до вашого рецепта.
            Запишіться на прийом за телефоном.
          </p>
          <a href={SITE.phoneHref} className={buttonVariants({ size: "lg", variant: "secondary" })}>
            {SITE.phone}
          </a>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-12">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Новинки</h2>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-7xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <Truck className="size-6 text-primary" />
            <div>
              <div className="text-sm font-semibold">Доставка по Україні</div>
              <div className="text-xs text-muted-foreground">Нова пошта, Укрпошта, кур&apos;єр</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <ShieldCheck className="size-6 text-primary" />
            <div>
              <div className="text-sm font-semibold">Гарантія якості</div>
              <div className="text-xs text-muted-foreground">Офіційна продукція перевірених брендів</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <Stethoscope className="size-6 text-primary" />
            <div>
              <div className="text-sm font-semibold">Консультація лікаря</div>
              <div className="text-xs text-muted-foreground">Допомога у підборі лінз та оправ</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

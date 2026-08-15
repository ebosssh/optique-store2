"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function randomSlugSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

function toInt(value: FormDataEntryValue | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : undefined;
}

function revalidateStorefront(categorySlug?: string, slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin/products");
  if (categorySlug) revalidatePath(`/catalog/${categorySlug}`);
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function createProduct(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "");
  const category = await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });

  const price = toInt(formData.get("price"));
  if (price === undefined) throw new Error("Ціна обов'язкова");

  const data = {
    name: String(formData.get("name") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim(),
    type: category.type,
    categoryId: category.id,
    price,
    oldPrice: toInt(formData.get("oldPrice")) ?? null,
    description: String(formData.get("description") ?? "").trim(),
    gender: String(formData.get("gender") ?? "унісекс"),
    packSize: (formData.get("packSize") ? String(formData.get("packSize")).trim() : null) || null,
    colorHex: String(formData.get("colorHex") ?? "#1f2937"),
    inStock: formData.get("inStock") === "on",
    isNew: formData.get("isNew") === "on",
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = `${category.slug}-${randomSlugSuffix()}`;
    try {
      await prisma.product.create({ data: { ...data, slug } });
      break;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002" && attempt < 2) continue;
      throw err;
    }
  }

  revalidateStorefront(category.slug);
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "");
  const category = await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });

  const price = toInt(formData.get("price"));
  if (price === undefined) throw new Error("Ціна обов'язкова");

  const existing = await prisma.product.findUniqueOrThrow({ where: { id: productId } });

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      brand: String(formData.get("brand") ?? "").trim(),
      type: category.type,
      categoryId: category.id,
      price,
      oldPrice: toInt(formData.get("oldPrice")) ?? null,
      description: String(formData.get("description") ?? "").trim(),
      gender: String(formData.get("gender") ?? "унісекс"),
      packSize: (formData.get("packSize") ? String(formData.get("packSize")).trim() : null) || null,
      colorHex: String(formData.get("colorHex") ?? "#1f2937"),
      inStock: formData.get("inStock") === "on",
      isNew: formData.get("isNew") === "on",
    },
  });

  revalidateStorefront(category.slug, existing.slug);
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  const existing = await prisma.product.delete({
    where: { id: productId },
    include: { category: true },
  });
  revalidateStorefront(existing.category.slug, existing.slug);
  redirect("/admin/products");
}

export async function updateOrderStatus(orderId: string, status: "NEW" | "CONFIRMED" | "CANCELLED") {
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { updateProduct } from "../../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Редагувати товар</h1>
      <div className="mt-6">
        <ProductForm categories={categories} product={product} action={boundUpdate} submitLabel="Зберегти зміни" />
      </div>
      <div className="mt-8 max-w-2xl border-t pt-6">
        <DeleteProductButton productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}

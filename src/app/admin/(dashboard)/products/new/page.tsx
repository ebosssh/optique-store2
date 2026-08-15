import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "../../actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Новий товар</h1>
      <div className="mt-6">
        <ProductForm categories={categories} action={createProduct} submitLabel="Створити товар" />
      </div>
    </div>
  );
}

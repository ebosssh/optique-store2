import type { Category, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const GENDERS = ["унісекс", "чоловічі", "жіночі", "дитячі"];

export function ProductForm({
  categories,
  product,
  action,
  submitLabel,
}: {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Назва товару *</Label>
          <Input id="name" name="name" required defaultValue={product?.name} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="brand">Бренд *</Label>
          <Input id="brand" name="brand" required defaultValue={product?.brand} className="mt-1.5" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="categoryId">Категорія *</Label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId}
            className="mt-1.5 flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="" disabled>
              Оберіть...
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="gender">Стать</Label>
          <select
            id="gender"
            name="gender"
            defaultValue={product?.gender ?? "унісекс"}
            className="mt-1.5 flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="colorHex">Колір заглушки</Label>
          <Input
            id="colorHex"
            name="colorHex"
            type="color"
            defaultValue={product?.colorHex ?? "#c2703d"}
            className="mt-1.5 h-8 w-full p-1"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="price">Ціна, грн *</Label>
          <Input id="price" name="price" type="number" min={0} required defaultValue={product?.price} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="oldPrice">Стара ціна (якщо знижка)</Label>
          <Input id="oldPrice" name="oldPrice" type="number" min={0} defaultValue={product?.oldPrice ?? undefined} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="packSize">Формат / фасування</Label>
          <Input
            id="packSize"
            name="packSize"
            placeholder="напр. 30 шт., одноденні"
            defaultValue={product?.packSize ?? undefined}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Опис</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={product?.description} className="mt-1.5" />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} className="size-4 rounded border-input" />
          В наявності
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? false} className="size-4 rounded border-input" />
          Позначити як новинку
        </label>
      </div>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}

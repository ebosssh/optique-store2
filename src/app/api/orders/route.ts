import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OrderPayload = {
  name: string;
  phone: string;
  city: string;
  address: string;
  comment?: string;
  paymentType: string;
  items: { productId: string; quantity: number }[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as OrderPayload;

  if (!body.name?.trim() || !body.phone?.trim() || !body.city?.trim() || !body.address?.trim()) {
    return NextResponse.json({ error: "Заповніть обов'язкові поля" }, { status: 400 });
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: "Кошик порожній" }, { status: 400 });
  }

  const MAX_QUANTITY_PER_ITEM = 50;

  const quantityByProductId = new Map<string, number>();
  for (const i of body.items) {
    const quantity = Math.trunc(Number(i.quantity));
    if (!i.productId || !Number.isFinite(quantity) || quantity <= 0 || quantity > MAX_QUANTITY_PER_ITEM) {
      return NextResponse.json({ error: "Некоректний товар у кошику" }, { status: 400 });
    }
    quantityByProductId.set(i.productId, (quantityByProductId.get(i.productId) ?? 0) + quantity);
  }

  const products = await prisma.product.findMany({
    where: { id: { in: [...quantityByProductId.keys()] } },
  });
  if (products.length !== quantityByProductId.size) {
    return NextResponse.json({ error: "Деякі товари більше не доступні" }, { status: 400 });
  }
  if (products.some((p) => !p.inStock)) {
    return NextResponse.json({ error: "Деякі товари закінчились на складі" }, { status: 400 });
  }

  const total = products.reduce((sum, p) => sum + p.price * quantityByProductId.get(p.id)!, 0);

  const order = await prisma.order.create({
    data: {
      name: body.name.trim(),
      phone: body.phone.trim(),
      city: body.city.trim(),
      address: body.address.trim(),
      comment: body.comment?.trim() || null,
      paymentType: body.paymentType,
      total,
      items: {
        create: products.map((p) => ({
          productId: p.id,
          productName: p.name,
          price: p.price,
          quantity: quantityByProductId.get(p.id)!,
        })),
      },
    },
  });

  return NextResponse.json({ id: order.id });
}

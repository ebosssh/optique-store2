import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OrderPayload = {
  name: string;
  phone: string;
  city: string;
  address: string;
  comment?: string;
  paymentType: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as OrderPayload;

  if (!body.name?.trim() || !body.phone?.trim() || !body.city?.trim() || !body.address?.trim()) {
    return NextResponse.json({ error: "Заповніть обов'язкові поля" }, { status: 400 });
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: "Кошик порожній" }, { status: 400 });
  }

  const total = body.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
        create: body.items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      },
    },
  });

  return NextResponse.json({ id: order.id });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewOrder } from "@/lib/telegram";
import { DIOPTER_OPTIONS } from "@/lib/diopter";
import { AXIS_OPTIONS, CYLINDER_OPTIONS } from "@/lib/toric";

type OrderPayload = {
  name: string;
  phone: string;
  city: string;
  address: string;
  comment?: string;
  paymentType: string;
  items: {
    productId: string;
    quantity: number;
    diopter?: string | null;
    sphere?: string | null;
    cylinder?: string | null;
    axis?: string | null;
  }[];
};

type Line = {
  productId: string;
  diopter: string | null;
  sphere: string | null;
  cylinder: string | null;
  axis: string | null;
  quantity: number;
};

const MAX_QUANTITY_PER_ITEM = 50;

function normalize(value: string | null | undefined): string | null {
  const trimmed = value ? String(value).trim() : "";
  return trimmed || null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as OrderPayload;

  if (!body.name?.trim() || !body.phone?.trim() || !body.city?.trim() || !body.address?.trim()) {
    return NextResponse.json({ error: "Заповніть обов'язкові поля" }, { status: 400 });
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: "Кошик порожній" }, { status: 400 });
  }

  // A diopter, or a sphere/cylinder/axis combination, distinguishes
  // otherwise-identical lines, so two different prescriptions of the same
  // product must stay separate order lines.
  const lines = new Map<string, Line>();
  for (const i of body.items) {
    const quantity = Math.trunc(Number(i.quantity));
    if (!i.productId || !Number.isFinite(quantity) || quantity <= 0 || quantity > MAX_QUANTITY_PER_ITEM) {
      return NextResponse.json({ error: "Некоректний товар у кошику" }, { status: 400 });
    }
    const diopter = normalize(i.diopter);
    const sphere = normalize(i.sphere);
    const cylinder = normalize(i.cylinder);
    const axis = normalize(i.axis);
    if (diopter && !DIOPTER_OPTIONS.includes(diopter)) {
      return NextResponse.json({ error: "Некоректна діоптрія" }, { status: 400 });
    }
    if (sphere && !DIOPTER_OPTIONS.includes(sphere)) {
      return NextResponse.json({ error: "Некоректна сфера" }, { status: 400 });
    }
    if (cylinder && !CYLINDER_OPTIONS.includes(cylinder)) {
      return NextResponse.json({ error: "Некоректний циліндр" }, { status: 400 });
    }
    if (axis && !AXIS_OPTIONS.includes(axis)) {
      return NextResponse.json({ error: "Некоректна вісь" }, { status: 400 });
    }
    const key = `${i.productId}::${diopter ?? ""}::${sphere ?? ""}::${cylinder ?? ""}::${axis ?? ""}`;
    const existing = lines.get(key);
    if (existing) existing.quantity += quantity;
    else lines.set(key, { productId: i.productId, diopter, sphere, cylinder, axis, quantity });
  }

  const productIds = [...new Set([...lines.values()].map((l) => l.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "Деякі товари більше не доступні" }, { status: 400 });
  }
  if (products.some((p) => !p.inStock)) {
    return NextResponse.json({ error: "Деякі товари закінчились на складі" }, { status: 400 });
  }

  const productById = new Map(products.map((p) => [p.id, p]));

  for (const line of lines.values()) {
    const product = productById.get(line.productId)!;
    if (product.type !== "LENSES") continue;
    if (product.isToric) {
      if (!line.sphere || !line.cylinder || !line.axis) {
        return NextResponse.json({ error: `Вкажіть сферу, циліндр і вісь для товару «${product.name}»` }, { status: 400 });
      }
    } else if (!line.diopter) {
      return NextResponse.json({ error: `Вкажіть діоптрію для товару «${product.name}»` }, { status: 400 });
    }
  }

  const items = [...lines.values()].map((line) => {
    const product = productById.get(line.productId)!;
    return {
      productId: product.id,
      productName: product.name,
      diopter: line.diopter,
      sphere: line.sphere,
      cylinder: line.cylinder,
      axis: line.axis,
      price: product.price,
      quantity: line.quantity,
    };
  });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const name = body.name.trim();
  const phone = body.phone.trim();
  const city = body.city.trim();
  const address = body.address.trim();
  const comment = body.comment?.trim() || null;

  const order = await prisma.order.create({
    data: {
      name,
      phone,
      city,
      address,
      comment,
      paymentType: body.paymentType,
      total,
      items: { create: items },
    },
  });

  await notifyNewOrder({ id: order.id, name, phone, city, address, comment, paymentType: body.paymentType, total, items });

  return NextResponse.json({ id: order.id });
}

import { PrismaClient, ProductType } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "opravy", name: "Оправи для зору", type: ProductType.GLASSES, order: 1 },
  { slug: "soncezahysni", name: "Сонцезахисні окуляри", type: ProductType.SUNGLASSES, order: 2 },
  { slug: "linzy", name: "Контактні лінзи (МКЛ)", type: ProductType.LENSES, order: 3 },
  { slug: "aksesuary", name: "Аксесуари", type: ProductType.ACCESSORY, order: 4 },
  { slug: "doglyad", name: "Засоби для догляду", type: ProductType.CARE, order: 5 },
] as const;

const palette = ["#c2703d", "#b45309", "#c2410c", "#9f1239", "#be123c", "#a16207", "#92400e", "#c26a52"];

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

const opravy = [
  ["Bergen Line BL-204", "Bergen Optic", 2390, null, "чоловічі"],
  ["Nordic Steel N-11", "Nordic Line", 3190, 3990, "чоловічі"],
  ["Aurora Round A-77", "Aurora", 2790, null, "жіночі"],
  ["Vantage Slim V-3", "Vantage", 3490, null, "унісекс"],
  ["ClearView Cat CV-9", "ClearView", 2590, 3290, "жіночі"],
  ["Junior Flex J-5", "Bergen Optic", 1690, null, "дитячі"],
  ["Solis Titan S-14", "Solis", 4290, null, "чоловічі"],
  ["Aurora Light A-21", "Aurora", 2190, 2790, "жіночі"],
] as const;

const soncezahysni = [
  ["Vantage Aviator VA-1", "Vantage", 3990, 4990, "унісекс"],
  ["Solis Wave S-8", "Solis", 3590, null, "жіночі"],
  ["Nordic Sport NS-6", "Nordic Line", 4190, null, "чоловічі"],
  ["Aurora Oversize A-45", "Aurora", 3290, 4290, "жіночі"],
  ["Bergen Classic BC-2", "Bergen Optic", 2990, null, "чоловічі"],
  ["ClearView Retro CV-17", "ClearView", 2790, 3490, "унісекс"],
] as const;

const linzy = [
  ["Softlens Day 30", "OptiLens", 780, null, "30 шт., одноденні"],
  ["Softlens Day Premium", "OptiLens", 1120, null, "30 шт., одноденні"],
  ["Comfort Month", "ClearLens", 950, null, "3 шт., місячні"],
  ["Comfort Month Toric", "ClearLens", 1290, null, "3 шт., торичні"],
  ["Hydra Multifocal", "OptiLens", 1650, null, "6 шт., мультифокальні"],
  ["Hydra Night&Day", "OptiLens", 1390, null, "6 шт., пролонгованого носіння"],
] as const;

const aksesuary = [
  ["Футляр класичний", "Bergen Optic", 290, null, "унісекс"],
  ["Футляр компактний магнітний", "Aurora", 350, null, "унісекс"],
  ["Серветка для лінз мікрофібра", "ClearView", 90, null, "унісекс"],
  ["Спрей для чищення оптики", "OptiCare", 190, null, "унісекс"],
  ["Шнурок для окулярів", "Nordic Line", 150, null, "унісекс"],
  ["Пінцет для контактних лінз", "ClearLens", 120, null, "унісекс"],
] as const;

const doglyad = [
  ["Розчин для лінз 360 мл", "ClearLens", 320, null, "унісекс"],
  ["Розчин для лінз 500 мл", "OptiCare", 410, null, "унісекс"],
  ["Краплі зволожувальні", "OptiCare", 260, null, "унісекс"],
  ["Контейнер для лінз", "ClearLens", 60, null, "унісекс"],
] as const;

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    catMap[c.slug] = created.id;
  }

  const groups: [string, ProductType, readonly (readonly [string, string, number, number | null, string])[]][] = [
    ["opravy", ProductType.GLASSES, opravy],
    ["soncezahysni", ProductType.SUNGLASSES, soncezahysni],
    ["linzy", ProductType.LENSES, linzy],
    ["aksesuary", ProductType.ACCESSORY, aksesuary],
    ["doglyad", ProductType.CARE, doglyad],
  ];

  let idx = 0;
  for (const [slug, type, items] of groups) {
    for (const [name, brand, price, oldPrice, extra] of items) {
      idx++;
      const isLens = type === ProductType.LENSES;
      await prisma.product.create({
        data: {
          slug: `${slug}-${idx}`,
          name,
          brand,
          type,
          price,
          oldPrice: oldPrice ?? undefined,
          description:
            type === ProductType.LENSES
              ? `Контактні лінзи ${name} від ${brand}. ${extra}. Проконсультуйтесь з лікарем-офтальмологом перед підбором.`
              : type === ProductType.CARE
              ? `${name} від ${brand} для догляду за контактними лінзами.`
              : type === ProductType.ACCESSORY
              ? `${name} від ${brand} — аксесуар для догляду та зберігання оптики.`
              : `Оправа ${name} від ${brand}. Якісні матеріали, сучасний дизайн, підходить під будь-яку діоптрійну лінзу.`,
          imageEmoji: isLens ? "🔵" : type === ProductType.CARE ? "🧴" : type === ProductType.ACCESSORY ? "🧳" : "👓",
          colorHex: pick(palette, idx),
          isNew: idx % 5 === 0,
          packSize: isLens || type === ProductType.CARE ? extra : null,
          gender: isLens || type === ProductType.CARE ? "унісекс" : extra,
          categoryId: catMap[slug],
        },
      });
    }
  }

  console.log(`Seeded ${idx} products across ${categories.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

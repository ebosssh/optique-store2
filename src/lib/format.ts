export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("uk-UA").format(value)} грн`;
}

export const SITE = {
  name: "OptikaZir",
  fullName: "OptikaZir — салон оптики",
  phone: "+38 (067) 123-45-67",
  phoneHref: "tel:+380671234567",
  storePhone: "+38 (067) 987-65-43",
  storePhoneHref: "tel:+380679876543",
  email: "info@optikazir.ua",
  city: "Київ",
  address: "вул. Хрещатик, 22",
  hours: "Пн–Нд: 09:00–20:00",
  instagram: "https://instagram.com",
};

export const CATEGORY_LABELS: Record<string, { title: string; description: string }> = {
  opravy: {
    title: "Оправи для зору",
    description: "Оправи для окулярів з діоптріями — класичні, металеві, пластикові, дитячі.",
  },
  soncezahysni: {
    title: "Сонцезахисні окуляри",
    description: "Сонцезахисні окуляри з UV-захистом для чоловіків, жінок та унісекс.",
  },
  linzy: {
    title: "Контактні лінзи (МКЛ)",
    description: "Одноденні, місячні, торичні та мультифокальні контактні лінзи провідних виробників.",
  },
  aksesuary: {
    title: "Аксесуари",
    description: "Футляри, серветки, шнурки та інші аксесуари для догляду за оптикою.",
  },
  doglyad: {
    title: "Засоби для догляду",
    description: "Розчини, краплі та контейнери для догляду за контактними лінзами.",
  },
};

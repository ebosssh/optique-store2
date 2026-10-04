export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("uk-UA").format(value)} грн`;
}

export const SITE = {
  name: "OptikaZir",
  fullName: "OptikaZir — салон оптики",
  phone: "+38 (066) 988-02-03",
  phoneHref: "tel:+380669880203",
  storePhone: "+38 (067) 987-65-43",
  storePhoneHref: "tel:+380679876543",
  email: "info@optikazir.ua",
  city: "Первомайськ",
  address: "вул. Шевченка, 15",
  hours: "Пн–Пт: 09:00–18:00, Сб: 09:00–17:00, Нд: 09:00–16:00",
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

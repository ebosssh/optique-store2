export default function DeliveryPaymentPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold">Доставка та оплата</h1>

      <h2 className="mt-8 text-lg font-semibold">Доставка</h2>
      <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
        <li>Нова пошта (відділення або кур&apos;єром) — 1–3 робочих дні</li>
        <li>Укрпошта — 3–5 робочих днів</li>
        <li>Самовивіз із салону — у день замовлення</li>
      </ul>

      <h2 className="mt-8 text-lg font-semibold">Оплата</h2>
      <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
        <li>Оплата при отриманні (готівкою або карткою)</li>
        <li>Оплата на картку — реквізити надає менеджер після підтвердження замовлення</li>
      </ul>

      <p className="mt-8 text-sm text-muted-foreground">
        Після оформлення замовлення на сайті наш менеджер зателефонує для підтвердження деталей доставки та оплати.
      </p>
    </div>
  );
}

type OrderForNotification = {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  comment: string | null;
  paymentType: string;
  total: number;
  items: { productName: string; price: number; quantity: number }[];
};

function buildMessage(order: OrderForNotification): string {
  const lines = [
    `Нове замовлення №${order.id.slice(-8).toUpperCase()}`,
    "",
    `Клієнт: ${order.name}`,
    `Телефон: ${order.phone}`,
    `Місто: ${order.city}`,
    `Адреса: ${order.address}`,
  ];
  if (order.comment) lines.push(`Коментар: ${order.comment}`);
  lines.push(`Оплата: ${order.paymentType === "cod" ? "при отриманні" : "на картку"}`);
  lines.push("", "Товари:");
  for (const item of order.items) {
    lines.push(`- ${item.productName} × ${item.quantity} — ${item.price * item.quantity} грн`);
  }
  lines.push("", `Разом: ${order.total} грн`);
  return lines.join("\n");
}

// No-ops when Telegram isn't configured, and never throws — a notification
// failure must not break order creation for the customer.
export async function notifyNewOrder(order: OrderForNotification): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: buildMessage(order) }),
    });
    if (!res.ok) {
      console.error("Telegram notification failed:", await res.text());
    }
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

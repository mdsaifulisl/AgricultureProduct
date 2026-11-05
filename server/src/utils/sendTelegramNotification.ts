import prisma from "../config/prisma.js";

interface OrderItemNotification {
  name: string;
  quantity: number;
  price: number;
  unit?: string | null;
}

interface OrderNotificationData {
  trackingId: string;
  fullName: string;
  phone: string;
  address: string;
  note?: string | null;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: string;
  items: OrderItemNotification[];
}

export const sendTelegramOrderNotification = async (
  order: OrderNotificationData,
) => {
  try {
    const settings = await prisma.siteSetting.findFirst();

    if (!settings?.telegramBotToken || !settings?.telegramChatId) {
      console.log("Telegram Bot Token or Chat ID is missing in Site Settings.");
      return;
    }

    const { telegramBotToken, telegramChatId } = settings;

    // ১. আইটেমের লিস্টের অতিরিক্ত স্পেস বাদ দিয়ে ক্লিন ফরম্যাট
    const itemListText = order.items
      .map(
        (item, index) =>
          `${index + 1}. <b>${item.name}</b> x ${item.quantity} ${item.unit || ""} - ৳${item.price * item.quantity}`
      )
      .join("\n");

    // ২. টেমপ্লেট লিটেরালের ভেতরের বাম পাশের সব ট্যাব/স্পেস রিমুভ করা হয়েছে
    const message = 
`🛍️ <b>নতুন একটি অর্ডার এসেছে!</b>
─────────────────────
🆔 <b>Order ID:</b> <code>${order.trackingId}</code>
👤 <b>Customer:</b> ${order.fullName}
📞 <b>Phone:</b> <code>${order.phone}</code>
📍 <b>Address:</b> ${order.address}
${order.note ? `📝 <b>Note:</b> ${order.note}\n` : ""}📦 <b>Ordered Items:</b>
${itemListText}

💰 <b>Subtotal:</b> ৳${order.totalAmount - order.deliveryFee}
🚚 <b>Delivery Fee:</b> ৳${order.deliveryFee}
💵 <b>Total Amount:</b> ৳${order.totalAmount} (${order.paymentMethod})
─────────────────────
⏰ <b>Time:</b> ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}`;

    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error:", errorData);
    }
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
};


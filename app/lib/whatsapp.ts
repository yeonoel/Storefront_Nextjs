import { buildWhatsAppUrl } from "@/app/types/store";
import { formatPrice } from "./utils";

interface OrderItem {
  productName: string;
  variantName?: string;
  color?: string | null;
  size?: string | null;
  quantity: number;
  price: string;
}

interface OrderSummary {
  orderId: string;
  customerName?: string;
  customerPhone: string;
  city?: string;
  neighborhood?: string;
  items: OrderItem[];
  total: number;
  storeName: string;
}

export function buildOrderWhatsAppMessage(order: OrderSummary): string {
  const lines: string[] = [`Bonjour, voici ma commande :`, ``];

  order.items.forEach((item) => {
    lines.push(`🛍️ *${item.productName}*`);
    if (item.color) lines.push(`   Couleur : ${item.color}`);
    if (item.size) lines.push(`   Taille : ${item.size}`);
    lines.push(`   Quantité : ${item.quantity}`);
    lines.push(`   Prix : ${formatPrice(item.price)}`);
    lines.push(``);
  });

  lines.push(`💰 *Total : ${formatPrice(String(order.total))}*`);
  lines.push(``);

  if (order.customerName) lines.push(`👤 Nom : ${order.customerName}`);
  lines.push(`📞 Téléphone : ${order.customerPhone}`);
  if (order.neighborhood) lines.push(`📍 Quartier : ${order.neighborhood}`);
  if (order.city) lines.push(`🏙️ Ville : ${order.city}`);
  lines.push(``);
  lines.push(
    `Numéro de commande : #${order.orderId.slice(0, 8).toUpperCase()}`,
  );

  return lines.join("\n");
}

export function buildOrderWhatsAppUrl(
  whatsappNumber: string,
  order: OrderSummary,
): string {
  const message = buildOrderWhatsAppMessage(order);
  return buildWhatsAppUrl(whatsappNumber, message);
}

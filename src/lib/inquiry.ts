import type { CartItem, Product } from "@/domain/catalog";
import { formatMoney } from "./money";

export type CustomerShipping = { name: string; phone: string; address: string; notes: string };

export function buildWhatsAppOrder(items: CartItem[], products: Product[]) {
  const money = (minor: number) => formatMoney(minor).replace(/\u00a0/g, " ");
  const lines = items.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ item, product }] : [];
  });
  const total = lines.reduce((sum, { item, product }) => sum + item.quantity * product.priceMinor, 0);
  return [
    "*FreshCrops Order Request*", "",
    ...lines.flatMap(({ item, product }, index) => [
      `${index + 1}. *${product.name}*`,
      `   Quantity: ${item.quantity}`,
      `   Price: ${money(product.priceMinor)} × ${item.quantity}`,
      `   Line total: ${money(product.priceMinor * item.quantity)}`, "",
    ]),
    "————————————", `*Total: ${money(total)}*`, "",
    "Please confirm availability and delivery charges. Thank you!",
  ].join("\n");
}

export const buildWhatsAppUrl = (number: string, message: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export function buildCheckoutMessage(items: CartItem[], products: Product[], customer: CustomerShipping, tracking?: { orderId: string; trackingUrl: string }) {
  return [
    "*FreshCrops Confirmed Order Request*", "",
    ...(tracking ? ["*Order Tracking*", `Order ID: ${tracking.orderId}`, `Track order: ${tracking.trackingUrl}`, ""] : []),
    "*Customer & Delivery Details*",
    `Name: ${customer.name.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    `Shipping address: ${customer.address.trim()}`,
    `Delivery notes: ${customer.notes.trim() || "None"}`, "",
    buildWhatsAppOrder(items, products).replace("*FreshCrops Order Request*\n\n", ""),
  ].join("\n");
}

import type { Product } from "@/domain/catalog";

export function packagingOptions(product: Product) {
  const unit = product.unit.toLowerCase();
  if (unit.includes("kg") || unit.includes("bulk")) return [product.unit, "Custom bulk quantity"];
  if (unit.includes("piece") || unit.includes("pc")) return [product.unit, "Multi-piece order"];
  if (unit.includes("pack") || unit.includes("tray") || unit.includes("tin") || unit.includes("bag")) return [product.unit, "Case quantity on request"];
  return [product.unit, "Wholesale packaging available"];
}

export const productCareText = (product: Product) =>
  ["vegetables", "leafy", "peppers", "herbs"].includes(product.categoryId)
    ? "Store refrigerated and use promptly for best quality."
    : "Storage and handling instructions are supplied with confirmed orders.";

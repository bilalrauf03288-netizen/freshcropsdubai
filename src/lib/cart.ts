import type { CartItem, Product } from "@/domain/catalog";

export const clampQuantity = (quantity: number) => Math.max(1, Math.min(99, Math.floor(quantity || 1)));
export function addCartItem(items: CartItem[], productId: string, quantity = 1): CartItem[] {
  const found = items.find((item) => item.productId === productId);
  return found
    ? items.map((item) => item.productId === productId ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item)
    : [...items, { productId, quantity: clampQuantity(quantity) }];
}
export const setCartQuantity = (items: CartItem[], productId: string, quantity: number) =>
  quantity <= 0 ? items.filter((item) => item.productId !== productId) : items.map((item) => item.productId === productId ? { ...item, quantity: clampQuantity(quantity) } : item);
export const itemCount = (items: CartItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);
export const subtotalMinor = (items: CartItem[], products: Product[]) => items.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.priceMinor ?? 0) * item.quantity, 0);

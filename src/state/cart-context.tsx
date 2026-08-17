"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/domain/catalog";
import { addCartItem, itemCount, setCartQuantity, subtotalMinor } from "@/lib/cart";

const STORAGE_KEY = "freshcrops-cart-v1";
type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(parsed)) setItems(parsed.filter((item) => typeof item?.productId === "string" && Number.isFinite(item?.quantity)));
    } catch { localStorage.removeItem(STORAGE_KEY); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items, ready]);
  const value = useMemo<CartContextValue>(() => ({
    items,
    count: itemCount(items),
    subtotal: subtotalMinor(items, products),
    isOpen,
    setOpen,
    addItem: (productId, quantity = 1) => {
      setItems((current) => addCartItem(current, productId, quantity));
      const product = products.find((candidate) => candidate.id === productId);
      setToast(`${product?.name ?? "Product"} added to cart`);
      window.setTimeout(() => setToast(""), 2800);
    },
    removeItem: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
    setQuantity: (productId, quantity) => setItems((current) => setCartQuantity(current, productId, quantity)),
    clearCart: () => setItems([]),
  }), [items, isOpen, products]);
  return <CartContext.Provider value={value}>{children}{toast && <div className="cartToast" role="status" aria-live="polite"><span aria-hidden>✓</span><div><strong>Added successfully</strong><p>{toast}</p></div><button onClick={() => setOpen(true)}>View cart</button></div>}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}

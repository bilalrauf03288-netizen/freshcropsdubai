"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Product } from "@/domain/catalog";
import { formatMoney } from "@/lib/money";
import { useCart } from "@/state/cart-context";
import { QuickView } from "./quick-view";

export function ProductCard({ product, related = [] }: { product: Product; related?: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const [quickView, setQuickView] = useState(false);
  const closeQuickView = useCallback(() => setQuickView(false), []);
  const { addItem } = useCart();
  return <article className="productCard">
    <div className="productImage">{product.badge && <span className="badge">{product.badge}</span>}<Image src={product.image} alt={product.name} fill sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw" /><button className="quickButton" onClick={() => setQuickView(true)}>Quick view</button></div>
    <div className="productBody"><p className="productCategory">{product.categoryId}</p><h3>{product.name}</h3><p className="unit">{product.unit}</p><strong>{formatMoney(product.priceMinor)}</strong>
      <div className="addRow"><label><span className="srOnly">Quantity for {product.name}</span><input type="number" min="1" max="99" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(99, Number(event.target.value) || 1)))} /></label><button onClick={() => addItem(product.id, quantity)}>Add</button></div>
    </div>
    {quickView && <QuickView product={product} related={related} onClose={closeQuickView}/>}
  </article>;
}

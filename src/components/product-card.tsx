"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Product } from "@/domain/catalog";
import { formatMoney } from "@/lib/money";
import { useCart } from "@/state/cart-context";
import { QuickView } from "./quick-view";

export function ProductCard({ product, related = [] }: { product: Product; related?: Product[] }) {
  const [quickView, setQuickView] = useState(false);
  const closeQuickView = useCallback(() => setQuickView(false), []);
  const { addItem, getQuantity, setQuantity } = useCart();
  const quantity = getQuantity(product.id);
  const bumpQuantity = (delta: number) => setQuantity(product.id, quantity + delta);
  const quickAdd = () => addItem(product.id, 1);
  return <article className="productCard">
    <div className="productImage">{product.badge && <span className="badge">{product.badge}</span>}<Image src={product.image} alt={product.name} fill sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw" /><button className="quickButton" onClick={() => setQuickView(true)}>Quick view</button></div>
    <div className="productBody"><p className="productCategory">{product.categoryId}</p><h3>{product.name}</h3><p className="unit">{product.unit}</p><strong>{formatMoney(product.priceMinor)}</strong>
      <div className="addRow compactControls" aria-label={`Cart controls for ${product.name}`}>
        <div className="quantityPill" role="group" aria-label={`Quantity controls for ${product.name}`}>
          <button type="button" onClick={() => bumpQuantity(-1)} aria-label={`Decrease ${product.name}`}>−</button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => bumpQuantity(1)} aria-label={`Increase ${product.name}`}>+</button>
        </div>
        <button type="button" className={quantity > 0 ? "cartQuickButton active" : "cartQuickButton"} onClick={quickAdd} aria-label={`Add ${product.name} to cart`}>
          <span aria-hidden>🛒</span>
        </button>
      </div>
    </div>
    {quickView && <QuickView product={product} related={related} onClose={closeQuickView}/>}
  </article>;
}

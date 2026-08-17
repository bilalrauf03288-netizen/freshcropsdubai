"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/domain/catalog";
import { formatMoney } from "@/lib/money";
import { packagingOptions, productCareText } from "@/lib/product-details";
import { useCart } from "@/state/cart-context";

export function QuickView({ product, related, onClose }: { product: Product; related: Product[]; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", close); };
  }, [onClose]);
  return createPortal(<div className="modalBackdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
    <section className="quickModal" role="dialog" aria-modal="true" aria-labelledby={`quick-${product.id}`}>
      <button className="modalClose" onClick={onClose} aria-label="Close quick view">×</button>
      <div className="quickImage"><Image src={product.image} alt={product.name} fill sizes="(max-width: 760px) 100vw, 45vw" /></div>
      <div className="quickContent"><p className="eyebrow">{product.categoryId}</p><h2 id={`quick-${product.id}`}>{product.name}</h2><p className="quickPrice">{formatMoney(product.priceMinor)}</p><p>{product.description}</p>
        <h3>Packaging options</h3><ul>{packagingOptions(product).map((option) => <li key={option}>{option}</li>)}</ul>
        <h3>Product information</h3><p>{productCareText(product)} Nutritional specifications and origin documents are available on request.</p>
        <div className="quickAdd"><input aria-label={`Quantity for ${product.name}`} type="number" min="1" max="99" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}/><button onClick={() => addItem(product.id, quantity)}>Add to cart</button></div>
        <Link className="detailLink" href={`/products/${product.slug}`}>View full product details →</Link>
        {related.length > 0 && <div className="quickRelated"><h3>You may also like</h3><div>{related.slice(0, 3).map((item) => <Link href={`/products/${item.slug}`} key={item.id}><Image src={item.image} width={56} height={56} alt=""/><span>{item.name}</span></Link>)}</div></div>}
      </div>
    </section>
  </div>, document.body);
}

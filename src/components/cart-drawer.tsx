"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Product } from "@/domain/catalog";
import { siteConfig } from "@/config/site";
import { formatMoney } from "@/lib/money";
import { buildWhatsAppOrder, buildWhatsAppUrl } from "@/lib/inquiry";
import { useCart } from "@/state/cart-context";
import { CheckoutModal } from "./checkout-modal";
import { TrustBadges } from "./trust-badges";

export function CartDrawer({ products }: { products: Product[] }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);
  const { items, subtotal, isOpen, setOpen, removeItem, setQuantity, clearCart } = useCart();
  const lines = items.flatMap((item) => { const product = products.find((candidate) => candidate.id === item.productId); return product ? [{ ...item, product }] : []; });
  const message = buildWhatsAppOrder(items, products);
  const inquiryHref = buildWhatsAppUrl(siteConfig.whatsappNumber, message);
  return <><button className={isOpen ? "drawerBackdrop visible" : "drawerBackdrop"} aria-label="Close cart" onClick={() => setOpen(false)} />
    <aside className={isOpen ? "cartDrawer open" : "cartDrawer"} aria-label="Shopping cart" aria-hidden={!isOpen}>
      <div className="drawerHeader"><div><p className="eyebrow">Your selection</p><h2>Shopping cart</h2></div><button onClick={() => setOpen(false)} aria-label="Close cart">×</button></div>
      <div className="cartLines">{lines.length ? lines.map(({ product, quantity }) => <article className="cartLine" key={product.id}>
        <Image src={product.image} width={72} height={72} alt=""/><div><h3>{product.name}</h3><p>{formatMoney(product.priceMinor)} · {product.unit}</p><div className="quantity"><button onClick={() => setQuantity(product.id, quantity - 1)} aria-label={`Decrease ${product.name}`}>−</button><span>{quantity}</span><button onClick={() => setQuantity(product.id, quantity + 1)} aria-label={`Increase ${product.name}`}>+</button></div></div><button className="remove" onClick={() => removeItem(product.id)} aria-label={`Remove ${product.name}`}>Remove</button>
      </article>) : <div className="emptyCart"><span>🧺</span><h3>Your basket is empty</h3><p>Add something fresh from the catalogue.</p><button onClick={() => setOpen(false)}>Continue shopping</button></div>}</div>
      {lines.length > 0 && <div className="cartSummary"><div><span>Estimated subtotal</span><strong>{formatMoney(subtotal)}</strong></div><p>Availability, delivery and final pricing will be confirmed by our team.</p><TrustBadges compact/><button className="primaryButton checkoutButton" onClick={() => { setOpen(false); setCheckoutOpen(true); }}>Proceed to checkout</button><a className="quickOrderLink" href={inquiryHref} target="_blank" rel="noreferrer">Quick WhatsApp order</a><button className="clearButton" onClick={clearCart}>Clear cart</button></div>}
    </aside>
    {checkoutOpen && <CheckoutModal items={items} products={products} subtotal={subtotal} onClose={closeCheckout} onSuccess={() => undefined}/>}
  </>;
}

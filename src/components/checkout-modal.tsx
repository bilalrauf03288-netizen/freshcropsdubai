"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/domain/catalog";
import { siteConfig } from "@/config/site";
import { buildCheckoutMessage, buildWhatsAppUrl, type CustomerShipping } from "@/lib/inquiry";
import { formatMoney } from "@/lib/money";
import { TrustBadges } from "./trust-badges";

const emptyCustomer: CustomerShipping = { name: "", phone: "", address: "", notes: "" };
export function CheckoutModal({ items, products, subtotal, onClose, onSuccess }: { items: CartItem[]; products: Product[]; subtotal: number; onClose: () => void; onSuccess: () => void }) {
  const [customer, setCustomer] = useState(emptyCustomer);
  const [submitted, setSubmitted] = useState(false);
  const lines = useMemo(() => items.flatMap((item) => { const product = products.find((candidate) => candidate.id === item.productId); return product ? [{ item, product }] : []; }), [items, products]);
  const message = buildCheckoutMessage(items, products, customer);
  const whatsappHref = buildWhatsAppUrl(siteConfig.whatsappNumber, message);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", close); };
  }, [onClose]);
  const update = (field: keyof CustomerShipping, value: string) => setCustomer((current) => ({ ...current, [field]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true); onSuccess(); };
  return <div className="modalBackdrop checkoutBackdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
    <section className="checkoutModal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <button className="modalClose" onClick={onClose} aria-label="Close checkout">×</button>
      {!submitted ? <><header><p className="eyebrow">Secure inquiry checkout</p><h2 id="checkout-title">Delivery details</h2><p>No payment is collected yet. Our team confirms availability and delivery on WhatsApp.</p></header>
        <div className="checkoutLayout"><form className="checkoutForm" onSubmit={submit} id="checkout-form"><label>Full name<input required minLength={2} autoComplete="name" value={customer.name} onChange={(event) => update("name", event.target.value)} placeholder="Your full name"/></label><label>Phone number<input required minLength={7} inputMode="tel" autoComplete="tel" value={customer.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+971 5X XXX XXXX"/></label><label className="fullField">Shipping address<textarea required minLength={8} autoComplete="street-address" value={customer.address} onChange={(event) => update("address", event.target.value)} placeholder="Building, street, area and emirate" rows={3}/></label><label className="fullField">Delivery notes <span>(optional)</span><textarea value={customer.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Preferred time, landmark or handling request" rows={3}/></label></form>
          <aside className="checkoutSummary"><h3>Order summary</h3><div className="checkoutLines">{lines.map(({ item, product }) => <div key={product.id}><Image src={product.image} width={52} height={52} alt=""/><span><strong>{product.name}</strong><small>{item.quantity} × {formatMoney(product.priceMinor)}</small></span><b>{formatMoney(product.priceMinor * item.quantity)}</b></div>)}</div><div className="checkoutTotal"><span>Estimated total</span><strong>{formatMoney(subtotal)}</strong></div><p>Final delivery fee and availability will be confirmed before dispatch.</p><TrustBadges compact/></aside></div>
        <footer className="checkoutActions"><button type="button" onClick={onClose}>Back to cart</button><button type="submit" form="checkout-form">Review order</button></footer></>
      : <div className="checkoutSuccess"><span aria-hidden>✓</span><p className="eyebrow">Ready to dispatch</p><h2 id="checkout-title">Your order request is prepared.</h2><p>Review the summary below, then send it directly to FreshCrops on WhatsApp. Your order is confirmed only after our team replies.</p><div className="customerReview"><strong>{customer.name}</strong><span>{customer.phone}</span><span>{customer.address}</span>{customer.notes && <span>Note: {customer.notes}</span>}<b>{lines.length} products · {formatMoney(subtotal)}</b></div><a className="primaryButton" href={whatsappHref} target="_blank" rel="noreferrer">Send complete order on WhatsApp</a><button className="startOver" onClick={() => setSubmitted(false)}>Edit delivery details</button></div>}
    </section>
  </div>;
}

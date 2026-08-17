"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/domain/catalog";
import { formatMoney } from "@/lib/money";
import { packagingOptions, productCareText } from "@/lib/product-details";
import { useCart } from "@/state/cart-context";
import { ProductCard } from "./product-card";
import { TrustBadges } from "./trust-badges";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  return <main className="productPage"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={`/?category=${product.categoryId}#shop`}>{product.categoryId}</Link><span>/</span><span>{product.name}</span></nav>
    <section className="productHero"><div className="productHeroImage"><Image src={product.image} alt={product.name} fill priority sizes="(max-width: 760px) 100vw, 50vw" /></div><div className="productHeroContent"><p className="eyebrow">{product.categoryId}</p><h1>{product.name}</h1><p className="detailPrice">{formatMoney(product.priceMinor)}</p><p className="detailLead">{product.description}</p><div className="availability"><span/>Available for inquiry</div><h2>Packaging</h2><div className="packagingOptions">{packagingOptions(product).map((option) => <span key={option}>{option}</span>)}</div><h2>Storage & product information</h2><p>{productCareText(product)} Verified nutritional specifications, source and compliance documentation are available from our sales team.</p><div className="detailAdd"><input aria-label="Quantity" type="number" min="1" max="99" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}/><button onClick={() => addItem(product.id, quantity)}>Add to cart</button></div></div></section>
    <TrustBadges/>{related.length > 0 && <section className="relatedSection"><div className="sectionIntro"><p className="eyebrow">Complete your order</p><h2>Related products</h2></div><div className="productGrid">{related.slice(0, 4).map((item) => <ProductCard product={item} related={related.filter((candidate) => candidate.id !== item.id)} key={item.id}/>)}</div></section>}
  </main>;
}

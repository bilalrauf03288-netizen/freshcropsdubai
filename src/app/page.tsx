import { Suspense } from "react";
import catalog from "@/data/catalog.json";
import type { Category, HeroSlide, Product } from "@/domain/catalog";
import { CartProvider } from "@/state/cart-context";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Catalog } from "@/components/catalog";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { BusinessClients } from "@/components/business-clients";

const products = catalog.products as Product[];
const categories = catalog.categories as Category[];
const featuredSlides: HeroSlide[] = [
  { id: "featured-vegetables", eyebrow: "Harvested for everyday freshness", title: "Fresh vegetables, selected daily.", description: "Crisp market vegetables sourced for homes, restaurants and professional kitchens across Dubai.", image: "/images/hero-2-58.webp", categoryId: "vegetables", ctaLabel: "Shop vegetables" },
  { id: "featured-dates-eggs", eyebrow: "Premium pantry favourites", title: "Premium dates & organic eggs.", description: "Naturally rich dates and carefully selected eggs for wholesome breakfasts, gifting and professional kitchens.", image: "/images/hero-eggs-dates-original.webp", categoryId: "eggs-dates", ctaLabel: "Shop eggs & dates" },
  { id: "featured-fruits", eyebrow: "Farm-fresh variety", title: "Fresh fruits & daily essentials.", description: "Colourful fruit and dependable everyday produce, gathered into one convenient FreshCrops selection.", image: "/images/hero-fruits-essentials-original.webp", categoryId: "bulk", ctaLabel: "Shop fresh selection" },
];
export default function Home() {
  return <CartProvider products={products}><div id="top"><Header/><main><Hero slides={featuredSlides}/><Suspense fallback={<p className="loading">Loading catalogue…</p>}><Catalog categories={categories} products={products}/></Suspense><section className="wholesale" id="wholesale"><p className="eyebrow">Built for business</p><h2>Wholesale supply without the guesswork.</h2><p>Flexible case sizes, market-responsive pricing and dependable UAE delivery for restaurants, retailers and traders.</p><a className="primaryButton" href="mailto:hello@freshcrops.com?subject=Wholesale inquiry">Request wholesale pricing</a></section><BusinessClients/><section className="trust"><article><span>01</span><h2>Sourced daily</h2><p>Shorter time from market to kitchen.</p></article><article><span>02</span><h2>Bulk ready</h2><p>Practical formats for professional buyers.</p></article><article><span>03</span><h2>Reliable delivery</h2><p>Clear confirmation before every order.</p></article></section></main><Footer/><CartDrawer products={products}/></div></CartProvider>;
}

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
const slides = catalog.slides as HeroSlide[];
const categoryDescription = (id: string) => categories.find((category) => category.id === id)?.description ?? "Explore this FreshCrops collection.";
const featuredSlides: HeroSlide[] = [
  { ...slides[2], id: "featured-vegetables", eyebrow: "Featured category · Fresh vegetables", title: "Best-selling vegetables", description: categoryDescription("vegetables"), categoryId: "vegetables", ctaLabel: "Shop vegetables" },
  { ...slides[3], id: "featured-market", eyebrow: "Featured category · Market selection", title: "Fresh fruit & veg selection", description: categoryDescription("bulk"), categoryId: "bulk", ctaLabel: "Shop fresh selection" },
  { ...slides[4], id: "featured-pantry", eyebrow: "Featured category · Pantry essentials", title: "Pantry staples for every kitchen", description: categoryDescription("oils"), categoryId: "oils", ctaLabel: "Shop pantry staples" },
];
export default function Home() {
  return <CartProvider products={products}><div id="top"><Header/><main><Hero slides={featuredSlides}/><Suspense fallback={<p className="loading">Loading catalogue…</p>}><Catalog categories={categories} products={products}/></Suspense><section className="wholesale" id="wholesale"><p className="eyebrow">Built for business</p><h2>Wholesale supply without the guesswork.</h2><p>Flexible case sizes, market-responsive pricing and dependable UAE delivery for restaurants, retailers and traders.</p><a className="primaryButton" href="mailto:hello@freshcrops.com?subject=Wholesale inquiry">Request wholesale pricing</a></section><BusinessClients/><section className="trust"><article><span>01</span><h2>Sourced daily</h2><p>Shorter time from market to kitchen.</p></article><article><span>02</span><h2>Bulk ready</h2><p>Practical formats for professional buyers.</p></article><article><span>03</span><h2>Reliable delivery</h2><p>Clear confirmation before every order.</p></article></section></main><Footer/><CartDrawer products={products}/></div></CartProvider>;
}

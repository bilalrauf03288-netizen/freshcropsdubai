import type { Metadata } from "next";
import { notFound } from "next/navigation";
import catalog from "@/data/catalog.json";
import type { Product } from "@/domain/catalog";
import { CartProvider } from "@/state/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductDetail } from "@/components/product-detail";

const products = catalog.products as Product[];
export const dynamicParams = false;
export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  const title = product.name;
  const description = `${product.name} — ${product.unit}. Request fresh delivery or wholesale pricing from FreshCrops UAE.`;
  return { title, description, alternates: { canonical: `/products/${slug}` }, openGraph: { title, description, type: "website", images: [{ url: product.image, alt: product.name }] } };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id);
  return <CartProvider products={products}><Header/><ProductDetail product={product} related={related}/><Footer/><CartDrawer products={products}/></CartProvider>;
}

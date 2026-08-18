import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OrderTracker } from "@/components/order-tracker";
import { CartProvider } from "@/state/cart-context";
import catalog from "@/data/catalog.json";
import type { Product } from "@/domain/catalog";

export const metadata: Metadata = { title: "Track your order", description: "Check the latest status of your FreshCrops order." };
export default async function TrackPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <CartProvider products={catalog.products as Product[]}><Header/><OrderTracker initialId={id?.slice(0, 40)}/><Footer/></CartProvider>;
}

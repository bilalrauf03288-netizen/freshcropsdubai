import { NextResponse } from "next/server";
import catalog from "@/data/catalog.json";
import type { Product } from "@/domain/catalog";
import { siteConfig } from "@/config/site";
import { generateOrderId } from "@/lib/order-id";
import { savePlacedOrder, StorageUnavailableError } from "@/lib/orders-repository";

export const runtime = "nodejs";
const products = catalog.products as Product[];
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const customer = body.customer as Record<string, unknown> | undefined;
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const checkoutKey = clean(body.checkoutKey, 100);
    const safeCustomer = { name: clean(customer?.name, 100), phone: clean(customer?.phone, 40), address: clean(customer?.address, 500), notes: clean(customer?.notes, 500) };
    if (!checkoutKey || safeCustomer.name.length < 2 || safeCustomer.phone.length < 7 || safeCustomer.address.length < 8 || rawItems.length === 0 || rawItems.length > 100) {
      return NextResponse.json({ error: "Please provide valid delivery details and cart items." }, { status: 400 });
    }
    const items = rawItems.map((raw) => {
      const candidate = raw as Record<string, unknown>;
      const product = products.find((entry) => entry.id === candidate.productId && entry.available);
      const quantity = Number(candidate.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error("INVALID_ITEMS");
      return { productId: product.id, name: product.name, quantity, unit: product.unit, unitPriceMinor: product.priceMinor, lineTotalMinor: product.priceMinor * quantity };
    });
    const subtotalMinor = items.reduce((sum, item) => sum + item.lineTotalMinor, 0);
    const order = await savePlacedOrder({ id: generateOrderId(), checkoutKey, customer: safeCustomer, items, subtotalMinor });
    return NextResponse.json({ ...order, trackingUrl: `${siteConfig.siteUrl}/track?id=${encodeURIComponent(order.orderId)}` }, { status: 201 });
  } catch (error) {
    if (error instanceof StorageUnavailableError) return NextResponse.json({ error: "Order tracking is being configured. Please contact us on WhatsApp." }, { status: 503 });
    if (error instanceof Error && error.message === "INVALID_ITEMS") return NextResponse.json({ error: "One or more cart items are invalid." }, { status: 400 });
    console.error("Order creation failed", error);
    return NextResponse.json({ error: "We could not prepare tracking right now. Please try again." }, { status: 500 });
  }
}

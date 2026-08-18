import { NextResponse } from "next/server";
import { findPublicOrder, StorageUnavailableError } from "@/lib/orders-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    if (!/^FC-\d{8}-[A-F0-9]{8}$/.test(orderId)) return NextResponse.json({ error: "Enter a valid FreshCrops order ID." }, { status: 400 });
    const order = await findPublicOrder(orderId);
    return order ? NextResponse.json(order, { headers: { "Cache-Control": "no-store" } }) : NextResponse.json({ error: "Order ID not found. Check the ID and try again." }, { status: 404 });
  } catch (error) {
    if (error instanceof StorageUnavailableError) return NextResponse.json({ error: "Tracking service is not configured yet." }, { status: 503 });
    console.error("Order lookup failed", error);
    return NextResponse.json({ error: "Tracking is temporarily unavailable." }, { status: 500 });
  }
}

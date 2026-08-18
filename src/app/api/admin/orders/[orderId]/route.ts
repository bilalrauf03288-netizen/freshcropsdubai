import { NextResponse } from "next/server";
import { isOrderStatus } from "@/domain/order";
import { isAdminRequest } from "@/lib/admin-auth";
import { setOrderStatus, StorageUnavailableError } from "@/lib/orders-repository";

export const runtime = "nodejs";
export async function PATCH(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { status } = await request.json() as { status?: unknown };
    if (!isOrderStatus(status)) return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    const { orderId } = await params;
    const order = await setOrderStatus(orderId, status);
    return order ? NextResponse.json(order) : NextResponse.json({ error: "Order not found." }, { status: 404 });
  } catch (error) {
    if (error instanceof StorageUnavailableError) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
    console.error("Status update failed", error); return NextResponse.json({ error: "Could not update this order." }, { status: 500 });
  }
}

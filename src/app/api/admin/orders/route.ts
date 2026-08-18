import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listAdminOrders, StorageUnavailableError } from "@/lib/orders-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json({ orders: await listAdminOrders() }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) {
    if (error instanceof StorageUnavailableError) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
    console.error("Admin order list failed", error); return NextResponse.json({ error: "Could not load orders." }, { status: 500 });
  }
}

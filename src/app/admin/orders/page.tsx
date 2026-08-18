import type { Metadata } from "next";
import { AdminOrders } from "@/components/admin-orders";
export const metadata: Metadata = { title: "Order administration", robots: { index: false, follow: false } };
export default function AdminOrdersPage() { return <AdminOrders/>; }

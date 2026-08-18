export const orderStatuses = ["order_placed", "processing", "in_transit", "delivered"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const orderStatusLabels: Record<OrderStatus, string> = {
  order_placed: "Order Placed",
  processing: "Processing",
  in_transit: "In Transit",
  delivered: "Delivered",
};

export type OrderHistoryEntry = { status: OrderStatus; at: string };
export type OrderItemSnapshot = { productId: string; name: string; quantity: number; unit: string; unitPriceMinor: number; lineTotalMinor: number };
export type PublicOrder = { orderId: string; status: OrderStatus; subtotalMinor: number; currency: "AED"; itemCount: number; createdAt: string; updatedAt: string; history: OrderHistoryEntry[] };
export type AdminOrder = PublicOrder & { customer: { name: string; phone: string; address: string; notes: string }; items: OrderItemSnapshot[] };

export const isOrderStatus = (value: unknown): value is OrderStatus => typeof value === "string" && orderStatuses.includes(value as OrderStatus);

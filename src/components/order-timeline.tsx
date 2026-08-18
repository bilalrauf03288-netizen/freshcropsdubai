import { orderStatusLabels, orderStatuses, type PublicOrder } from "@/domain/order";

export function OrderTimeline({ order }: { order: PublicOrder }) {
  const current = orderStatuses.indexOf(order.status);
  return <div className="orderTimeline" aria-label={`Order status: ${orderStatusLabels[order.status]}`}>
    {orderStatuses.map((status, index) => <div className={index <= current ? "complete" : ""} key={status}>
      <span aria-hidden>{index < current ? "✓" : index + 1}</span>
      <div><strong>{orderStatusLabels[status]}</strong><small>{index <= current ? (order.history.findLast((entry) => entry.status === status)?.at ? new Date(order.history.findLast((entry) => entry.status === status)!.at).toLocaleString("en-AE", { dateStyle: "medium", timeStyle: "short" }) : "Completed") : "Pending"}</small></div>
    </div>)}
  </div>;
}

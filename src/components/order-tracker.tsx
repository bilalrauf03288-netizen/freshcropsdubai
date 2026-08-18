"use client";

import { FormEvent, useState } from "react";
import type { PublicOrder } from "@/domain/order";
import { formatMoney } from "@/lib/money";
import { OrderTimeline } from "./order-timeline";

export function OrderTracker({ initialId = "" }: { initialId?: string }) {
  const [orderId, setOrderId] = useState(initialId.toUpperCase());
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const lookup = async (event?: FormEvent) => {
    event?.preventDefault(); setLoading(true); setError(""); setOrder(null);
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId.trim().toUpperCase())}`, { cache: "no-store" });
      const data = await response.json() as PublicOrder & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Order could not be found.");
      setOrder(data);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Tracking is temporarily unavailable."); }
    finally { setLoading(false); }
  };
  return <main className="trackingPage"><section className="trackingHero"><p className="eyebrow">Live order updates</p><h1>Track your FreshCrops order.</h1><p>Enter the tracking ID included in your WhatsApp order message.</p><form onSubmit={lookup}><label className="srOnly" htmlFor="tracking-id">FreshCrops order ID</label><input id="tracking-id" required value={orderId} onChange={(event) => setOrderId(event.target.value.toUpperCase())} placeholder="FC-20260818-1A2B3C4D" autoComplete="off"/><button disabled={loading}>{loading ? "Checking…" : "Track order"}</button></form>{error && <p className="trackingError" role="alert">{error}</p>}</section>
    {order && <section className="trackingResult" aria-live="polite"><div className="trackingResultHeader"><div><p className="eyebrow">Order {order.orderId}</p><h2>Your delivery journey</h2></div><div><span>{order.itemCount} items</span><strong>{formatMoney(order.subtotalMinor)}</strong></div></div><OrderTimeline order={order}/><p className="trackingHelp">Need help? Keep your order ID ready and message our WhatsApp support team.</p></section>}
  </main>;
}

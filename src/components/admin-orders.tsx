"use client";

import { FormEvent, useState } from "react";
import { orderStatusLabels, orderStatuses, type AdminOrder, type OrderStatus } from "@/domain/order";
import { formatMoney } from "@/lib/money";

export function AdminOrders() {
  const [token, setToken] = useState(""); const [orders, setOrders] = useState<AdminOrder[]>([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const load = async (event?: FormEvent) => {
    event?.preventDefault(); setLoading(true); setError("");
    try { const response = await fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }); const data = await response.json() as { orders?: AdminOrder[]; error?: string }; if (!response.ok) throw new Error(data.error ?? "Could not load orders."); setOrders(data.orders ?? []); sessionStorage.setItem("freshcrops-admin-token", token); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load orders."); } finally { setLoading(false); }
  };
  const update = async (orderId: string, status: OrderStatus) => {
    setError(""); const response = await fetch(`/api/admin/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) }); const data = await response.json() as AdminOrder & { error?: string }; if (!response.ok) { setError(data.error ?? "Update failed."); return; } setOrders((current) => current.map((order) => order.orderId === orderId ? data : order));
  };
  return <main className="adminPage"><header><p className="eyebrow">FreshCrops operations</p><h1>Order status dashboard</h1><p>Customer details stay protected behind the admin token.</p></header>
    <form className="adminLogin" onSubmit={load}><label>Admin access token<input type="password" required value={token} onChange={(event) => setToken(event.target.value)} autoComplete="current-password"/></label><button disabled={loading}>{loading ? "Loading…" : "Open dashboard"}</button></form>{error && <p className="trackingError" role="alert">{error}</p>}
    {orders.length > 0 && <div className="adminOrderList">{orders.map((order) => <article key={order.orderId}><div className="adminOrderTop"><div><strong>{order.orderId}</strong><span>{new Date(order.createdAt).toLocaleString("en-AE")}</span></div><b>{formatMoney(order.subtotalMinor)}</b></div><div className="adminCustomer"><strong>{order.customer.name}</strong><a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a><span>{order.customer.address}</span>{order.customer.notes && <small>{order.customer.notes}</small>}</div><ul>{order.items.map((item) => <li key={item.productId}><span>{item.quantity} × {item.name}</span><b>{formatMoney(item.lineTotalMinor)}</b></li>)}</ul><label>Status<select value={order.status} onChange={(event) => update(order.orderId, event.target.value as OrderStatus)}>{orderStatuses.map((status) => <option value={status} key={status}>{orderStatusLabels[status]}</option>)}</select></label></article>)}</div>}
    {!loading && token && !error && orders.length === 0 && <p className="adminEmpty">No orders have been placed yet.</p>}
  </main>;
}

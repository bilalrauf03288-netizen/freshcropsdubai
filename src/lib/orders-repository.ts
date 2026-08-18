import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { AdminOrder, OrderHistoryEntry, OrderItemSnapshot, OrderStatus, PublicOrder } from "@/domain/order";

export class StorageUnavailableError extends Error {}
let sqlClient: NeonQueryFunction<false, false> | undefined;
let schemaPromise: Promise<void> | undefined;

function getSql() {
  if (!process.env.DATABASE_URL) throw new StorageUnavailableError("Order storage is not configured.");
  sqlClient ??= neon(process.env.DATABASE_URL);
  return sqlClient;
}

async function ensureSchema() {
  if (!schemaPromise) schemaPromise = (async () => {
    const sql = getSql();
    await sql`CREATE TABLE IF NOT EXISTS freshcrops_orders (
      id text PRIMARY KEY,
      checkout_key text UNIQUE NOT NULL,
      status text NOT NULL DEFAULT 'order_placed',
      customer_name text NOT NULL,
      customer_phone text NOT NULL,
      shipping_address text NOT NULL,
      delivery_notes text NOT NULL DEFAULT '',
      items jsonb NOT NULL,
      subtotal_minor integer NOT NULL,
      currency text NOT NULL DEFAULT 'AED',
      status_history jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`CREATE INDEX IF NOT EXISTS freshcrops_orders_created_idx ON freshcrops_orders (created_at DESC)`;
  })().catch((error) => { schemaPromise = undefined; throw error; });
  return schemaPromise;
}

type OrderRow = { id: string; status: OrderStatus; customer_name: string; customer_phone: string; shipping_address: string; delivery_notes: string; items: OrderItemSnapshot[]; subtotal_minor: number; currency: "AED"; status_history: OrderHistoryEntry[]; created_at: string | Date; updated_at: string | Date };
const iso = (value: string | Date) => new Date(value).toISOString();
const toPublic = (row: OrderRow): PublicOrder => ({ orderId: row.id, status: row.status, subtotalMinor: row.subtotal_minor, currency: row.currency, itemCount: row.items.reduce((sum, item) => sum + item.quantity, 0), createdAt: iso(row.created_at), updatedAt: iso(row.updated_at), history: row.status_history });
const toAdmin = (row: OrderRow): AdminOrder => ({ ...toPublic(row), customer: { name: row.customer_name, phone: row.customer_phone, address: row.shipping_address, notes: row.delivery_notes }, items: row.items });

export async function savePlacedOrder(input: { id: string; checkoutKey: string; customer: { name: string; phone: string; address: string; notes: string }; items: OrderItemSnapshot[]; subtotalMinor: number }) {
  await ensureSchema();
  const sql = getSql();
  const history = JSON.stringify([{ status: "order_placed", at: new Date().toISOString() }]);
  const rows = await sql`INSERT INTO freshcrops_orders (id, checkout_key, customer_name, customer_phone, shipping_address, delivery_notes, items, subtotal_minor, status_history)
    VALUES (${input.id}, ${input.checkoutKey}, ${input.customer.name}, ${input.customer.phone}, ${input.customer.address}, ${input.customer.notes}, ${JSON.stringify(input.items)}::jsonb, ${input.subtotalMinor}, ${history}::jsonb)
    ON CONFLICT (checkout_key) DO UPDATE SET customer_name=EXCLUDED.customer_name, customer_phone=EXCLUDED.customer_phone, shipping_address=EXCLUDED.shipping_address, delivery_notes=EXCLUDED.delivery_notes, items=EXCLUDED.items, subtotal_minor=EXCLUDED.subtotal_minor, updated_at=now()
    RETURNING *` as OrderRow[];
  return toPublic(rows[0]);
}

export async function findPublicOrder(id: string) {
  await ensureSchema(); const sql = getSql();
  const rows = await sql`SELECT * FROM freshcrops_orders WHERE id=${id} LIMIT 1` as OrderRow[];
  return rows[0] ? toPublic(rows[0]) : null;
}

export async function listAdminOrders() {
  await ensureSchema(); const sql = getSql();
  const rows = await sql`SELECT * FROM freshcrops_orders ORDER BY created_at DESC LIMIT 100` as OrderRow[];
  return rows.map(toAdmin);
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  await ensureSchema(); const sql = getSql();
  const entry = JSON.stringify({ status, at: new Date().toISOString() });
  const rows = await sql`UPDATE freshcrops_orders SET status=${status}, status_history=status_history || ${entry}::jsonb, updated_at=now() WHERE id=${id} RETURNING *` as OrderRow[];
  return rows[0] ? toAdmin(rows[0]) : null;
}

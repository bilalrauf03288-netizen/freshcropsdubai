import { randomBytes } from "node:crypto";

export function generateOrderId(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `FC-${date}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

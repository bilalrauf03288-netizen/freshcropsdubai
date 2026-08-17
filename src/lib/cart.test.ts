import { describe, expect, it } from "vitest";
import { addCartItem, clampQuantity, itemCount, setCartQuantity, subtotalMinor } from "./cart";
import type { Product } from "@/domain/catalog";

const product = { id: "carrot", priceMinor: 475 } as Product;
describe("cart domain", () => {
  it("merges duplicate products", () => expect(addCartItem([{ productId: "carrot", quantity: 2 }], "carrot", 3)).toEqual([{ productId: "carrot", quantity: 5 }]));
  it("clamps quantities", () => { expect(clampQuantity(0)).toBe(1); expect(clampQuantity(120)).toBe(99); });
  it("removes an item when quantity reaches zero", () => expect(setCartQuantity([{ productId: "carrot", quantity: 1 }], "carrot", 0)).toEqual([]));
  it("calculates count and subtotal", () => { const items = [{ productId: "carrot", quantity: 3 }]; expect(itemCount(items)).toBe(3); expect(subtotalMinor(items, [product])).toBe(1425); });
});

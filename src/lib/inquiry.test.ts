import { describe, expect, it } from "vitest";
import type { Product } from "@/domain/catalog";
import { buildCheckoutMessage, buildWhatsAppOrder, buildWhatsAppUrl } from "./inquiry";

const products = [{ id: "carrot", name: "Carrot", priceMinor: 475, currency: "AED" }] as Product[];
describe("WhatsApp inquiry", () => {
  it("includes items, quantities, line totals and total", () => {
    const message = buildWhatsAppOrder([{ productId: "carrot", quantity: 2 }], products);
    expect(message).toContain("Carrot");
    expect(message).toContain("Quantity: 2");
    expect(message).toContain("Line total: AED 9.50");
    expect(message).toContain("Total: AED 9.50");
  });
  it("creates the configured WhatsApp URL", () => {
    expect(buildWhatsAppUrl("+971 58 127 3079", "Order test")).toBe("https://wa.me/971581273079?text=Order%20test");
  });
  it("includes customer shipping details in checkout dispatch", () => {
    const message = buildCheckoutMessage([{ productId: "carrot", quantity: 2 }], products, { name: "Sara", phone: "+971500000000", address: "Dubai Marina", notes: "Evening" }, { orderId: "FC-20260818-A1B2C3D4", trackingUrl: "https://freshcropsdubai.vercel.app/track?id=FC-20260818-A1B2C3D4" });
    expect(message).toContain("Name: Sara");
    expect(message).toContain("Shipping address: Dubai Marina");
    expect(message).toContain("Carrot");
    expect(message).toContain("Total: AED 9.50");
    expect(message).toContain("Order ID: FC-20260818-A1B2C3D4");
    expect(message).toContain("Track order: https://freshcropsdubai.vercel.app/track?id=FC-20260818-A1B2C3D4");
  });
});

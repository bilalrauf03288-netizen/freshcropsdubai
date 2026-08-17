import type { MetadataRoute } from "next";
import catalog from "@/data/catalog.json";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freshcrops.com";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 }, ...catalog.products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: .8 }))];
}

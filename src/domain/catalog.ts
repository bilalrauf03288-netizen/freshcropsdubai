export type Badge = "new" | "bestseller" | "wholesale";

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description?: string;
  priceMinor: number;
  currency: "AED";
  unit: string;
  image: string;
  badge?: Badge;
  available: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  order: number;
};

export type HeroSlide = { id: string; eyebrow: string; title: string; description: string; image: string; categoryId?: string; ctaLabel?: string };
export type CartItem = { productId: string; quantity: number };

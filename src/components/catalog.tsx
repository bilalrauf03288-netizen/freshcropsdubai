"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, Product } from "@/domain/catalog";
import { ProductCard } from "./product-card";

export function Catalog({ categories, products }: { categories: Category[]; products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const highestPrice = Math.max(...products.map((product) => product.priceMinor));
  const [maxPrice, setMaxPrice] = useState(highestPrice);
  const [sort, setSort] = useState("featured");
  const anchorFor = useCallback((categoryId: string) => categoryId === "all" ? "all-products" : categories.find((item) => item.id === categoryId)?.slug ?? categoryId, [categories]);
  const selectCategory = (categoryId: string) => {
    setCategory(categoryId);
    const anchorId = anchorFor(categoryId);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.getElementById(anchorId)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    }));
  };
  useEffect(() => {
    setCategory(searchParams.get("category") ?? "all");
  }, [searchParams]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);
    const anchor = anchorFor(category);
    router.replace(`${params.size ? `?${params}` : "/"}#${anchor}`, { scroll: false });
  }, [query, category, router, anchorFor]);
  const filtered = useMemo(() => {
    const matches = products.filter((product) => product.priceMinor <= maxPrice && (category === "all" || product.categoryId === category) && `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase().trim()));
    return [...matches].sort((a, b) => sort === "price-asc" ? a.priceMinor - b.priceMinor : sort === "price-desc" ? b.priceMinor - a.priceMinor : sort === "name" ? a.name.localeCompare(b.name) : 0);
  }, [products, category, query, maxPrice, sort]);
  const suggestions = useMemo(() => query.trim() ? products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase().trim())).slice(0, 5) : [], [products, query]);
  return <section className="catalog" id="shop">
    <div className="sectionIntro"><p className="eyebrow">Daily market selection</p><h2>Shop fresh & pantry essentials</h2><p>Search the complete catalogue or browse by category.</p></div>
    <div className="categoryRail" aria-label="Product categories"><button className={category === "all" ? "active" : ""} aria-controls="all-products" onClick={() => selectCategory("all")}><span className="allCategoryThumb" aria-hidden="true">{categories.slice(0, 4).map((item) => <Image src={item.image} width={96} height={96} alt="" key={item.id} loading="eager" quality={100} sizes="64px" />)}</span><span>All Products</span></button>{categories.map((item) => <button className={category === item.id ? "active" : ""} aria-controls={item.slug} key={item.id} onClick={() => selectCategory(item.id)}><span className="categoryImage" aria-hidden="true"><Image src={item.image} width={256} height={256} alt="" loading="eager" quality={100} sizes="(max-width: 620px) 112px, 128px" /></span><span>{item.name}</span></button>)}</div>
    <div className="categoryAnchors" aria-hidden="true"><span id="all-products"/>{categories.map((item) => <span id={item.slug} key={item.id}/>)}</div>
    <div className="catalogTools"><div className="searchWrap"><label className="searchBox"><span className="srOnly">Search products</span><input type="search" value={query} autoComplete="off" placeholder="Search vegetables, oils, flour…" onChange={(event) => setQuery(event.target.value)} /></label>{suggestions.length > 0 && <div className="searchSuggestions" role="listbox" aria-label="Product suggestions">{suggestions.map((product) => <button key={product.id} role="option" aria-selected={query === product.name} onClick={() => setQuery(product.name)}><Image src={product.image} width={42} height={42} alt=""/><span><strong>{product.name}</strong><small>{product.unit}</small></span></button>)}</div>}</div><p aria-live="polite">{filtered.length} products</p></div>
    <div className="filterBar"><label><span>Maximum price: AED {(maxPrice / 100).toFixed(2)}</span><input type="range" min="0" max={highestPrice} step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))}/></label><label><span>Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="name">Name A–Z</option></select></label></div>
    {filtered.length ? <div className="productGrid">{filtered.map((product) => <ProductCard product={product} related={products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id)} key={product.id}/>)}</div> : <div className="emptyState"><div className="emptyIllustration" aria-hidden>🥬</div><h3>No fresh matches yet</h3><p>Try a broader search, increase the price range or explore all categories.</p><button onClick={() => { setQuery(""); setCategory("all"); setMaxPrice(highestPrice); }}>Explore all products</button></div>}
  </section>;
}

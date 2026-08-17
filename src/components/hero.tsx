"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/domain/catalog";

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setCurrent((value) => (value + 1) % slides.length), 5500);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, slides.length]);
  const go = (index: number) => setCurrent((index + slides.length) % slides.length);
  return <section className="hero" aria-roledescription="carousel" aria-label="FreshCrops highlights" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    {slides.map((slide, index) => <article className={index === current ? "heroSlide active" : "heroSlide"} aria-hidden={index !== current} key={slide.id}>
      <Image src={slide.image} alt={`${slide.title} featured category`} fill priority fetchPriority="high" quality={100} sizes="(max-width: 1440px) 100vw, 1440px" />
      <div className="heroShade"/><div className="heroContent"><p className="eyebrow">{slide.eyebrow}</p><h1>{slide.title}</h1><p>{slide.description}</p><div className="heroActions"><Link className="primaryButton" href={`/?category=${slide.categoryId ?? "all"}#${slide.categoryId ?? "all-products"}`} scroll={false}>{slide.ctaLabel ?? "Shop now"}</Link><Link className="secondaryButton" href="/#all-products" scroll={false}>View all products</Link></div></div>
    </article>)}
    <button className="heroPrev" onClick={() => go(current - 1)} aria-label="Previous slide">‹</button><button className="heroNext" onClick={() => go(current + 1)} aria-label="Next slide">›</button>
    <div className="heroDots">{slides.map((slide, index) => <button key={slide.id} aria-label={`Go to slide ${index + 1}`} aria-current={index === current} onClick={() => go(index)} />)}</div>
  </section>;
}

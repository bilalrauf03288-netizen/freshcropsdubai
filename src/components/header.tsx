"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/state/cart-context";

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  return <>
    <div className="announcement"><span>Fresh delivery across Dubai · Wholesale pricing available</span><a href="https://wa.me/971581273079" target="_blank" rel="noreferrer"><i/> Support available on WhatsApp</a></div>
    <header className="siteHeader">
      <a className="brand" href="#top" aria-label="FreshCrops home"><Image src="/brand/freshcrops-logo-mark.png" width={36} height={36} alt="" priority />FreshCrops</a>
      <button className="menuButton" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span className="srOnly">Toggle navigation</span>☰</button>
      <nav id="main-navigation" className={open ? "mainNav open" : "mainNav"} aria-label="Main navigation">
        <a href="#top" onClick={() => setOpen(false)}>Home</a><a href="#shop" onClick={() => setOpen(false)}>Shop</a><a href="#wholesale" onClick={() => setOpen(false)}>Wholesale</a><a href="#contact" onClick={() => setOpen(false)}>Contact</a>
      </nav>
      <button className="cartButton" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${count} items`}><span className="cartLabel">Cart</span><span className="cartCount">{count}</span></button>
    </header>
  </>;
}

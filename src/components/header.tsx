"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/state/cart-context";

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  return <>
    <div className="announcement"><span>Fresh delivery across Dubai · Wholesale pricing available</span><a href="https://wa.me/971581273079" target="_blank" rel="noreferrer"><i/> Support available on WhatsApp</a></div>
    <header className="siteHeader">
      <Link className="brand" href="/#top" aria-label="FreshCrops home"><Image src="/brand/freshcrops-logo-mark.png" width={36} height={36} alt="" priority />FreshCrops</Link>
      <button className="menuButton" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span className="srOnly">Toggle navigation</span>☰</button>
      <nav id="main-navigation" className={open ? "mainNav open" : "mainNav"} aria-label="Main navigation">
        <Link href="/#top" onClick={() => setOpen(false)}>Home</Link><Link href="/#shop" onClick={() => setOpen(false)}>Shop</Link><Link href="/#wholesale" onClick={() => setOpen(false)}>Wholesale</Link><Link href="/track" onClick={() => setOpen(false)}>Track order</Link><Link href="/#contact" onClick={() => setOpen(false)}>Contact</Link>
      </nav>
      <button className="cartButton" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${count} items`}><span className="cartLabel">Cart</span><span className="cartCount">{count}</span></button>
    </header>
  </>;
}

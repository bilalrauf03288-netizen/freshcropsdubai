import { siteConfig } from "@/config/site";
import Image from "next/image";

export function Footer() {
  return <footer id="contact"><div className="footerAssurance"><span><i/> Freshness checked before dispatch</span><span>Delivery details confirmed personally</span><span>WhatsApp support available</span></div><div className="footerGrid"><div><a className="brand light" href="#top"><Image src="/brand/freshcrops-logo-mark.png" width={36} height={36} alt="" />FreshCrops</a><p>Fresh produce and trusted pantry staples for homes, restaurants and retailers across the UAE.</p></div><div><h2>Explore</h2><a href="#shop">Shop</a><a href="#wholesale">Wholesale</a></div><div><h2>Get in touch</h2><p>{siteConfig.location}</p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p>{siteConfig.phoneDisplay}</p><p className="supportOnline"><i/> Support available</p></div></div><div className="footerBottom"><span>© 2026 FreshCrops Trading L.L.C.</span><span>Catalog & inquiry prototype — payments disabled</span></div></footer>;
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { WhatsAppFloat } from "@/components/whatsapp-float";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://freshcrops.com"), title: { default: "FreshCrops | Fresh produce delivered", template: "%s | FreshCrops" }, description: "Fresh produce and pantry essentials for UAE homes and businesses.", openGraph: { title: "FreshCrops", description: "Fresh produce and pantry essentials for UAE homes and businesses.", type: "website", locale: "en_AE", siteName: "FreshCrops" }, twitter: { card: "summary_large_image", title: "FreshCrops", description: "Fresh produce and pantry essentials for UAE homes and businesses." } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={sans.variable}>{children}<WhatsAppFloat/></body></html>; }

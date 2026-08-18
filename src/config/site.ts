export const siteConfig = {
  name: "FreshCrops",
  location: "Dubai, UAE",
  email: "hello@freshcrops.com",
  phoneDisplay: "+971 58 127 3079",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971581273079",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://freshcropsdubai.vercel.app",
};

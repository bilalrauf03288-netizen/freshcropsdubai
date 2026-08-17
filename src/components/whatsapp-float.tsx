import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/inquiry";

export function WhatsAppFloat() {
  const href = buildWhatsAppUrl(siteConfig.whatsappNumber, "Hello FreshCrops, I need help with an order.");
  return <a className="whatsappFloat" href={href} target="_blank" rel="noreferrer" aria-label="Chat with FreshCrops on WhatsApp">
    <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3A12.92 12.92 0 0 0 5.08 22.77L3.25 29l6.38-1.68A12.96 12.96 0 1 0 16.04 3Zm0 23.74a10.74 10.74 0 0 1-5.48-1.5l-.39-.23-3.79 1 1.01-3.69-.25-.38a10.8 10.8 0 1 1 8.9 4.8Zm5.92-8.08c-.32-.16-1.92-.95-2.22-1.06-.3-.11-.51-.16-.73.16-.22.33-.84 1.06-1.03 1.28-.19.22-.38.24-.7.08-.33-.16-1.37-.5-2.61-1.61a9.74 9.74 0 0 1-1.81-2.25c-.19-.32-.02-.5.14-.66.15-.14.33-.38.49-.57.16-.19.21-.32.32-.54.11-.22.06-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.26-.64-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.41-.3.33-1.14 1.12-1.14 2.72s1.17 3.15 1.33 3.37c.16.22 2.3 3.51 5.57 4.92.78.34 1.39.54 1.86.69.78.25 1.5.21 2.06.13.63-.09 1.92-.79 2.19-1.55.27-.76.27-1.41.19-1.55-.08-.13-.3-.21-.62-.38Z"/></svg>
    <span>WhatsApp</span>
  </a>;
}

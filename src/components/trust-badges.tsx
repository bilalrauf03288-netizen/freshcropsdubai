const badges = [
  { title: "Freshness guarantee", text: "Quality checked before dispatch", icon: "leaf" },
  { title: "Hygienic packaging", text: "Handled and packed with care", icon: "shield" },
  { title: "Direct farm sourced", text: "Shorter, traceable supply chain", icon: "farm" },
  { title: "Secure WhatsApp checkout", text: "Confirm every detail before order", icon: "lock" },
] as const;

function TrustIcon({ type }: { type: typeof badges[number]["icon"] }) {
  if (type === "leaf") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4C12 4 6 7.5 6 14c0 1.2.3 2.2.8 3.1M20 4c0 8-3.5 14-10 14-1.2 0-2.3-.3-3.2-.9M20 4 5 19"/></svg>;
  if (type === "shield") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.7 2.8 8.4 7 10 4.2-1.6 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>;
  if (type === "farm") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-7 9 7M5 10v10h14V10M9 20v-6h6v6M8 9h.01M16 9h.01"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"/></svg>;
}

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "trustBadges compact" : "trustBadges"} aria-label="FreshCrops trust assurances">{badges.map((badge) => <div className="trustBadge" key={badge.title}><span><TrustIcon type={badge.icon}/></span><div><strong>{badge.title}</strong><small>{badge.text}</small></div></div>)}</div>;
}

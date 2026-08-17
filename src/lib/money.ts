export const formatMoney = (minor: number, currency = "AED") =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency, minimumFractionDigits: 2 }).format(minor / 100);

export function formatCurreny(amout: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amout);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}
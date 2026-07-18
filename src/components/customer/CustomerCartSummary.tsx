"use client";

import { formatCurrency } from "@/lib/format";

interface Props {
  subtotal: number;
  tax: number;
  total: number;
}

export function CustomerCartSummary({ subtotal, tax, total }: Props) {
  return (
    <div className="space-y-1 text-sm">
      <Row label="Subtotal" value={subtotal} />
      <Row label="Pajak (10%)" value={tax} />
      <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
        <span>Total</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}

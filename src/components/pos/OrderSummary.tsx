"use client";

import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export function OrderSummary() {
  const subtotal = useCartStore((s) => s.getSubtotal());
  const tax = useCartStore((s) => s.getTax());
  const total = useCartStore((s) => s.getTotal());

  return (
    <div className="space-y-2 rounded-lg bg-secondary/50 p-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tax (10%)</span>
        <span className="font-medium">{formatCurrency(tax)}</span>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between">
        <span className="text-base font-semibold">Total</span>
        <span className="text-lg font-bold text-primary">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}
"use client";

import { useCartStore } from "@/store/useCartStore";
import { useHydration } from "@/hooks/useHydration";
import { formatCurrency } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export function OrderSummary() {
  const hydrated = useHydration();

  const subtotal = useCartStore((s) => s.getSubtotal());
  const tax = useCartStore((s) => s.getTax());
  const total = useCartStore((s) => s.getTotal());
  const displaySubtotal = hydrated ? subtotal : 0;
  const displayTax = hydrated ? tax : 0;
  const displayTotal = hydrated ? total : 0;

  return (
    <div className="space-y-2 rounded-lg bg-secondary/50 p-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">{formatCurrency(displaySubtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tax (10%)</span>
        <span className="font-medium">{formatCurrency(displayTax)}</span>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between">
        <span className="text-base font-semibold">Total</span>
        <span className="text-lg font-bold text-primary">
          {formatCurrency(displayTotal)}
        </span>
      </div>
    </div>
  );
}
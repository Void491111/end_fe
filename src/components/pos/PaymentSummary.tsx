import { formatCurrency } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

interface PaymentSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

export function PaymentSummary({
  subtotal,
  tax,
  total,
  itemCount,
}: PaymentSummaryProps) {
  return (
    <div className="space-y-2 rounded-lg bg-secondary/50 p-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Subtotal ({itemCount} items)
        </span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tax (10%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      <Separator />
      <div className="flex justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-bold text-primary">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}
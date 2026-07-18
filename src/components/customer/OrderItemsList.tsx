"use client";

import { formatCurrency } from "@/lib/format";
import type { OrderStatusItem } from "@/hooks/useOrderStatus";

interface Props {
  items: OrderStatusItem[];
  total: number;
}

export function OrderItemsList({ items, total }: Props) {
  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden">
      <header className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold">Detail Pesanan</h3>
      </header>
      <div className="divide-y divide-border">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold line-clamp-1">{item.menu_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.quantity}x · {formatCurrency(Number(item.subtotal) / item.quantity)}
              </p>
            </div>
            <p className="text-sm font-bold tabular-nums shrink-0">
              {formatCurrency(Number(item.subtotal))}
            </p>
          </div>
        ))}
      </div>
      <footer className="px-4 py-3 border-t border-border bg-muted/30">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-base font-black text-primary tabular-nums">
            {formatCurrency(Number(total))}
          </span>
        </div>
      </footer>
    </section>
  );
}

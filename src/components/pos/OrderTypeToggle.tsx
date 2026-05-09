"use client";

import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";

export function OrderTypeToggle() {
  const orderType = useCartStore((s) => s.orderType);
  const setOrderType = useCartStore((s) => s.setOrderType);

  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg bg-secondary/50 p-1">
      <button
        onClick={() => setOrderType("dine-in")}
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition-all",
          orderType === "dine-in"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Dine In
      </button>
      <button
        onClick={() => setOrderType("takeaway")}
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition-all",
          orderType === "takeaway"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Takeaway
      </button>
    </div>
  );
}
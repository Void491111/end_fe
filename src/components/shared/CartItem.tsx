"use client";

import { Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { CartItem as CartItemType } from "@/types/order";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
}

export function CartItemRow({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="group flex gap-3 rounded-lg border border-border bg-card p-3"
    >
      {/* Image placeholder */}
      <div className="flex h-12 w-12 -shrink-0 items-center justify-center rounded-md bg-linear-to-br from-primary/20 to-accent text-lg">
        ☕
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-tight line-clamp-1">
            {item.name}
          </h4>
          <button
            onClick={() => removeItem(item.id)}
            className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          {formatCurrency(item.price)}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <span className="text-sm font-semibold text-primary">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
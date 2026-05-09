"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { MenuItem } from "@/types/menu";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const itemInCart = useCartStore((s) =>
    s.items.find((i) => i.id === item.id)
  );

  const quantity = itemInCart?.quantity ?? 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <Card
        onClick={() => addItem(item)}
        className={cn(
          "group relative cursor-pointer overflow-hidden border-border bg-card p-3 transition-all",
          "hover:border-primary/50 hover:shadow-md"
        )}
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-3">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent">
            <span className="text-3xl">☕</span>
          </div>

          {quantity > 0 && (
            <div className="absolute bottom-2 right-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground shadow-lg">
              {quantity}
            </div>
          )}

          <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
            <Plus className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-tight line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {item.description}
          </p>
          <p className="text-sm font-semibold text-primary pt-1">
            {formatCurrency(item.price)}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
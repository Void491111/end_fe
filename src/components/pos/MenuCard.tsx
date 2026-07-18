"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { MenuItem } from "@/types/menu";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/format";

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuCard({ item, onSelect }: MenuCardProps) {
  const cartItems = useCartStore((s) => s.items);

  const quantity = cartItems
    .filter((i) => i.id === item.id)
    .reduce((sum, current) => sum + current.quantity, 0);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(item)}
      className="group cursor-pointer overflow-hidden rounded-md bg-white dark:bg-[#131519] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-sm"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        {item.image ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl opacity-60">☕</span>
        )}

        {quantity > 0 && (
          <div className="absolute bottom-2 right-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
            {quantity}
          </div>
        )}

        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
          <Plus className="h-4 w-4" />
        </div>
      </div>

      {/* Info — text adaptive ngikut card bg */}
      <div className="p-3 space-y-0.5">
        <h3 className="text-sm font-bold leading-tight line-clamp-1 text-neutral-900 dark:text-neutral-100">
          {item.name}
        </h3>
        <p className="text-xs leading-tight line-clamp-1 text-neutral-500 dark:text-neutral-400">
          {item.description}
        </p>
        <p className="text-sm font-bold pt-1 text-neutral-900 dark:text-neutral-100">
          {formatCurrency(item.price)}
        </p>
      </div>
    </motion.div>
  );
}
"use client";

import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { MenuItem } from "@/types/menu";
import { formatCurrency } from "@/lib/format";
import { useCustomerCartStore } from "@/store/useCustomerCartStore";
import { useHydration } from "@/hooks/useHydration";

interface Props {
  item: MenuItem;
}

export function CustomerMenuCard({ item }: Props) {
  const hydrated = useHydration();
  const addItem = useCustomerCartStore((s) => s.addItem);
  const getQuantityFor = useCustomerCartStore((s) => s.getQuantityFor);

  const qty = hydrated ? getQuantityFor(item.id) : 0;
  const inCart = qty > 0;

  const handleClick = () => {
    addItem(item);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="relative cursor-pointer overflow-hidden rounded-md bg-white dark:bg-[#131519] border border-neutral-200 dark:border-neutral-800 shadow-sm"
    >
      {/* Qty badge kalau udah di cart */}
      {inCart && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-md">
          <Check className="h-3 w-3" />
          {qty}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-60">☕</span>
        )}

        {/* Add icon overlay */}
        <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <Plus className="h-4 w-4" strokeWidth={3} />
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-0.5">
        <h3 className="text-sm font-bold leading-tight line-clamp-1 text-neutral-900 dark:text-neutral-100">
          {item.name}
        </h3>
        <p className="text-[11px] leading-tight line-clamp-1 text-neutral-500 dark:text-neutral-400">
          {item.description}
        </p>
        <p className="text-sm font-bold pt-0.5 text-neutral-900 dark:text-neutral-100">
          {formatCurrency(item.price)}
        </p>
      </div>
    </motion.div>
  );
}

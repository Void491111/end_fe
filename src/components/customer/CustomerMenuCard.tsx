"use client";

import { toast } from "sonner";
import { motion } from "framer-motion";
import { MenuItem } from "@/types/menu";
import { formatCurrency } from "@/lib/format";

interface Props {
  item: MenuItem;
}

export function CustomerMenuCard({ item }: Props) {
  const handleClick = () => {
    // Placeholder — cart interaction ada di Batch 5B
    toast.info("Fitur order segera hadir", {
      description: `${item.name} · ${formatCurrency(item.price)}`,
    });
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="cursor-pointer overflow-hidden rounded-md bg-white dark:bg-[#131519] border border-neutral-200 dark:border-neutral-800 shadow-sm"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-60">☕</span>
        )}
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
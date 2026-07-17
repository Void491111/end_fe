"use client";

import { Plus, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { MenuItem } from "@/types/menu";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/format";

interface RecommendedMenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function RecommendedMenuCard({ item, onSelect }: RecommendedMenuCardProps) {
  const cartItems = useCartStore((s) => s.items);

  const quantity = cartItems
    .filter((i) => i.id === item.id)
    .reduce((sum, current) => sum + current.quantity, 0);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(item)}
      className="group cursor-pointer overflow-hidden rounded-md
                 bg-gradient-to-br from-amber-50 to-orange-100
                 dark:from-amber-950/40 dark:to-orange-950/50
                 border-2 border-amber-400/70 dark:border-amber-500/50
                 shadow-md shadow-amber-200/60 dark:shadow-amber-500/10
                 hover:shadow-lg hover:shadow-amber-300/70 dark:hover:shadow-amber-500/20
                 hover:border-amber-500 dark:hover:border-amber-400
                 transition-all"
    >
      {/* Image area — sama aspect-square biar size konsisten sama MenuCard */}
      <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-amber-100/60 dark:bg-amber-900/40">
        {item.imageUrl ? (
          <>
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay tipis biar badge kontras di atas image */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <span className="text-5xl opacity-70">🔥</span>
        )}

        {/* Best Seller badge — TOP LEFT, always visible, z-10 */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md
                        bg-gradient-to-r from-amber-500 to-orange-500
                        px-2 py-1 text-[10px] font-bold text-white
                        shadow-md ring-1 ring-amber-600/30">
          <Flame className="h-3 w-3" />
          <span>BEST SELLER</span>
        </div>

        {/* Quantity indicator — bottom right */}
        {quantity > 0 && (
          <div className="absolute bottom-2 right-2 z-10 flex h-6 min-w-6 items-center justify-center
                          rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground
                          shadow-lg">
            {quantity}
          </div>
        )}

        {/* Add hover indicator — bottom left, gak nabrak badge di atas */}
        {quantity === 0 && (
          <div className="absolute bottom-2 left-2 z-10 flex h-8 w-8 items-center justify-center
                          rounded-sm bg-amber-600 text-white opacity-0 transition-opacity
                          group-hover:opacity-100 shadow-lg">
            <Plus className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Info area — dedicated section, text gak overlap image */}
      <div className="p-3 space-y-0.5">
        <h3 className="text-sm font-bold leading-tight line-clamp-1 text-amber-900 dark:text-amber-100">
          {item.name}
        </h3>
        <p className="text-xs leading-tight line-clamp-1 text-amber-700/80 dark:text-amber-200/70">
          {item.description || "Menu favorit pelanggan"}
        </p>
        <p className="text-sm font-bold pt-1 text-amber-900 dark:text-amber-100">
          {formatCurrency(item.price)}
        </p>
      </div>
    </motion.div>
  );
}
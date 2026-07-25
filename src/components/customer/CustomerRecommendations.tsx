"use client";

import { Flame, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/format";
import { useCustomerCartStore } from "@/store/useCustomerCartStore";
import { useCustomerRecommendations, type RecommendedItem } from "@/hooks/useCustomerRecommendations";

export function CustomerRecommendations() {
  const { items, isLoading } = useCustomerRecommendations(6);

  // Silent hide kalo lagi loading atau kosong (misal belum ada order completed)
  if (isLoading || items.length === 0) return null;

  return (
    <section className="py-3">
      <header className="flex items-center gap-2 px-4 mb-2">
        <Flame className="h-4 w-4 text-orange-500" />
        <h2 className="text-sm font-bold">Paling Laris</h2>
        <span className="text-[10px] text-muted-foreground">· Best seller minggu ini</span>
      </header>

      {/* Horizontal scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2 w-max">
          {items.map((item) => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecommendationCard({ item }: { item: RecommendedItem }) {
  const addItem = useCustomerCartStore((s) => s.addItem);
  // Baca qty langsung dari items biar reaktif (cartItemId = `${item.id}`).
  const quantity = useCustomerCartStore(
    (s) => s.items.find((i) => i.cartItemId === item.id)?.quantity ?? 0
  );

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={() => addItem(item)}
      className="relative w-36 shrink-0 cursor-pointer overflow-hidden rounded-md bg-white dark:bg-[#131519] border border-neutral-200 dark:border-neutral-800 shadow-sm"
    >
      {/* Best seller badge */}
      <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 rounded-full bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-md">
        <Flame className="h-2.5 w-2.5" />
        #{item.totalSold} sold
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl opacity-60">☕</span>
        )}
        {/* Qty badge kalo udah di cart, kalo belum tampil tombol plus */}
        {quantity > 0 ? (
          <div className="absolute bottom-1.5 right-1.5 flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground shadow-lg">
            {quantity}
          </div>
        ) : (
          <div className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 space-y-0.5">
        <h3 className="text-xs font-bold leading-tight line-clamp-1 text-neutral-900 dark:text-neutral-100">
          {item.name}
        </h3>
        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
          {formatCurrency(item.price)}
        </p>
      </div>
    </motion.div>
  );
}
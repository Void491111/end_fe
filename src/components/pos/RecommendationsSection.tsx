"use client";

import { Flame, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { usePOSStore } from "@/store/usePOSStore";
import { RecommendedMenuCard } from "./RecommendedMenuCard";
import { CustomizationModal } from "./CustomizationModal";
import { MenuItem } from "@/types/menu";

export function RecommendationsSection() {
  const { items, isLoading } = useRecommendations(4);
  const activeCategory = usePOSStore((s) => s.activeCategory);
  const searchQuery = usePOSStore((s) => s.searchQuery);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Hide section kalau kasir lagi filter/search — biar gak keganggu
  if (activeCategory !== "all" || searchQuery.trim() !== "") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span className="text-sm text-muted-foreground">Loading rekomendasi...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <>
      <section className="border-b border-neutral-200 dark:border-neutral-800 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-white shadow-sm">
            <Flame className="h-3.5 w-3.5" />
            <span className="text-xs font-bold uppercase tracking-wide">Best Seller</span>
          </div>
          <span className="text-xs text-muted-foreground">Menu paling laris di Mooiste</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <RecommendedMenuCard
              key={item.id}
              item={item}
              onSelect={(clicked) => setSelectedItem(clicked)}
            />
          ))}
        </div>
      </section>

      <CustomizationModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
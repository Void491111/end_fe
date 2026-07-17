"use client";

import { Flame } from "lucide-react";
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

  const isFiltering = activeCategory !== "all" || searchQuery.trim() !== "";

  // Hide total: filtering, loading, atau ga ada best seller
  if (isFiltering || isLoading || items.length === 0) return null;

  return (
    <>
      <section className="border-b border-neutral-200 dark:border-neutral-800 px-4 pt-4 pb-3">
        <SectionHeader />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <RecommendedMenuCard key={item.id} item={item} onSelect={setSelectedItem} />
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

function SectionHeader() {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-white shadow-sm">
        <Flame className="h-3.5 w-3.5" />
        <span className="text-xs font-bold uppercase tracking-wide">Best Seller</span>
      </div>
      <span className="text-xs text-muted-foreground">Menu paling laris di Mooiste</span>
    </div>
  );
}
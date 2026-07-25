"use client";

import { useEffect, useState } from "react";
import { publicMenuApi } from "@/lib/api";
import { MenuItem } from "@/types/menu";

export interface RecommendedItem extends MenuItem {
  totalSold: number;
}

// Best-seller showcase. SENGAJA gak exclude item yang udah di cart —
// exclude-on-add bikin list bermutasi tiap tap item (kedip di HP).
// Card-nya nampilin badge qty sendiri, jadi list-nya diem total.
export function useCustomerRecommendations(limit: number = 4) {
  const [items, setItems] = useState<RecommendedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        const { data } = await publicMenuApi.recommendations({ limit });

        const mapped: RecommendedItem[] = (data.data || []).map((raw: any) => ({
          id: String(raw.id),
          name: raw.name,
          description: raw.description ?? "",
          price: parseFloat(raw.price),
          image: raw.image ?? null,
          imageUrl: raw.imageUrl ?? "",
          categoryId: raw.category?.slug ?? String(raw.category_id),
          isAvailable: true,
          totalSold: Number(raw.total_sold) || 0,
        }));

        setItems(mapped);
      } catch {
        setItems([]); // Silent fail — kalo error, hide section aja
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [limit]);

  return { items, isLoading };
}
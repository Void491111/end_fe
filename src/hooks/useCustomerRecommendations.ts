"use client";

import { useEffect, useMemo, useState } from "react";
import { publicMenuApi } from "@/lib/api";
import { useCustomerCartStore } from "@/store/useCustomerCartStore";
import { MenuItem } from "@/types/menu";

export interface RecommendedItem extends MenuItem {
  totalSold: number;
}

// Rekomendasi based on best-sellers (order_items dari orders completed).
// Exclude item yg udah di cart dilakukan CLIENT-SIDE biar section-nya
// gak ilang-timbul tiap nambah item (dulu refetch + toggle isLoading = flicker).
export function useCustomerRecommendations(limit: number = 4) {
  const cartItems = useCustomerCartStore((s) => s.items);
  const [allItems, setAllItems] = useState<RecommendedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch SEKALI aja (cuma depend ke limit). Ambil lebih biar ada backfill
  // setelah item ke-exclude.
  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        const { data } = await publicMenuApi.recommendations({ limit: limit + 5 });

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

        setAllItems(mapped);
      } catch {
        setAllItems([]); // Silent fail — kalo error, hide section aja
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [limit]);

  // Exclude cart item instan, tanpa network, tanpa nyentuh isLoading.
  const items = useMemo(() => {
    const cartIds = new Set(cartItems.map((i) => i.id));
    return allItems.filter((i) => !cartIds.has(i.id)).slice(0, limit);
  }, [allItems, cartItems, limit]);

  return { items, isLoading };
}

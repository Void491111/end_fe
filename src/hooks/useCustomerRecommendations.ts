"use client";

import { useEffect, useState } from "react";
import { publicMenuApi } from "@/lib/api";
import { useCustomerCartStore } from "@/store/useCustomerCartStore";
import { MenuItem } from "@/types/menu";

export interface RecommendedItem extends MenuItem {
  totalSold: number;
}

// Rekomendasi based on best-sellers (order_items dari orders completed)
// Exclude item yg udah di customer cart, biar rekomendasi selalu fresh
export function useCustomerRecommendations(limit: number = 4) {
  const cartItems = useCustomerCartStore((s) => s.items);
  const [items, setItems] = useState<RecommendedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const excludeIds = Array.from(new Set(cartItems.map((i) => i.id))).join(",");

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const { data } = await publicMenuApi.recommendations({
          limit,
          exclude: excludeIds || undefined,
        });

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

    fetch();
  }, [excludeIds, limit]);

  return { items, isLoading };
}

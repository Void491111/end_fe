"use client";

import { useEffect, useMemo, useState } from "react";
import { menuApi } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import { MenuItem } from "@/types/menu";

interface RecommendedItem extends MenuItem {
  totalSold: number;
}

export function useRecommendations(limit: number = 4) {
  const cartItems = useCartStore((s) => s.items);
  const [allItems, setAllItems] = useState<RecommendedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await menuApi.recommendations({ limit: limit + 5 });

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal load rekomendasi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [limit]);

  const items = useMemo(() => {
    const cartIds = new Set(cartItems.map((i) => i.id));
    return allItems.filter((i) => !cartIds.has(i.id)).slice(0, limit);
  }, [allItems, cartItems, limit]);

  return { items, isLoading, error };
}
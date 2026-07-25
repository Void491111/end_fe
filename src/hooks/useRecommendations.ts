"use client";

import { useEffect, useState } from "react";
import { menuApi } from "@/lib/api";
import { MenuItem } from "@/types/menu";

interface RecommendedItem extends MenuItem {
  totalSold: number;
}

// Best-seller showcase. SENGAJA gak exclude item yang udah di cart —
// exclude-on-add bikin list bermutasi tiap tambah item (flicker/kedip).
// Card-nya sendiri yang nampilin badge qty, jadi list-nya diem total.
export function useRecommendations(limit: number = 4) {
  const [items, setItems] = useState<RecommendedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await menuApi.recommendations({ limit });

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal load rekomendasi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [limit]);

  return { items, isLoading, error };
}
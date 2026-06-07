"use client";

import { useEffect, useMemo } from "react";
import { usePOSStore } from "@/store/usePOSStore";
import { useMenuStore } from "@/store/useMenuStore";

export function useMenu() {
  const activeCategory = usePOSStore((s) => s.activeCategory);
  const searchQuery = usePOSStore((s) => s.searchQuery);

  const allItems = useMenuStore((s) => s.items);
  const isLoading = useMenuStore((s) => s.isLoading);
  const error = useMenuStore((s) => s.error);
  const fetchMenus = useMenuStore((s) => s.fetchMenus);

  // Auto-fetch saat hook pertama kali di-mount, kalo data masih kosong
  useEffect(() => {
    if (allItems.length === 0) {
      fetchMenus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchCategory =
        activeCategory === "all" || item.categoryId === activeCategory;
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch && item.isAvailable;
    });
  }, [activeCategory, searchQuery, allItems]);

  return { items: filteredItems, isLoading, error };
}
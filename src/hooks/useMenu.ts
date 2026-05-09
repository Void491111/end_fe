"use client";

import { useMemo } from "react";
import { menuItems } from "@/data/menuItems";
import { usePOSStore } from "@/store/usePOSStore";

export function useMenu() {
    const activeCategory  = usePOSStore((s) => s.activeCategory);
    const searchQuery = usePOSStore((s) => s.searchQuery);

    const filteredItems = useMemo(() => {
        return menuItems.filter((item) => {
            const matchCategory = 
                activeCategory === "all" || item.categoryId === activeCategory;
            const matchSearch = item.name 
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            return matchCategory && matchSearch && item.isAvailable;
        });
    }, [activeCategory, searchQuery]);

    return { items: filteredItems };
}
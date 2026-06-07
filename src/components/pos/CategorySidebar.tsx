"use client";

import { useEffect } from "react";
import * as Icons from "lucide-react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { usePOSStore } from "@/store/usePOSStore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGrid, Loader2 } from "lucide-react";

// "All Menu" jadi entry pertama, sisanya dynamic dari API
const ALL_CATEGORY = {
  id: "all",
  name: "All Menu",
  icon: "LayoutGrid",
};

export function CategorySidebar() {
  const activeCategory = usePOSStore((s) => s.activeCategory);
  const setActiveCategory = usePOSStore((s) => s.setActiveCategory);

  const items = useCategoryStore((s) => s.items);
  const isLoading = useCategoryStore((s) => s.isLoading);
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);

  useEffect(() => {
    if (items.length === 0) {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gabungin "All Menu" + kategori dari API
  const allCategories = [ALL_CATEGORY, ...items];

  return (
    <aside className="w-24 border-r border-border bg-card">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-1 p-2">
          {isLoading && items.length === 0 ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            allCategories.map((category) => {
              const Icon =
                (Icons as unknown as Record<string, Icons.LucideIcon>)[
                  category.icon
                ] ?? LayoutGrid;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors hover:bg-accent/50 group"
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium leading-tight text-center transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {category.name}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
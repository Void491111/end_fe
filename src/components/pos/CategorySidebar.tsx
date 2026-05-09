"use client";

import * as Icons from "lucide-react";
import { categories } from "@/data/categories";
import { usePOSStore } from "@/store/usePOSStore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CategorySidebar() {
  const activeCategory = usePOSStore((s) => s.activeCategory);
  const setActiveCategory = usePOSStore((s) => s.setActiveCategory);

  return (
    <aside className="w-24 border-r border-border bg-card">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-1 p-2">
          {categories.map((category) => {
            const Icon =
              (Icons as unknown as Record<string, Icons.LucideIcon>)[
                category.icon
              ] ?? Icons.Coffee;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg p-3 transition-all",
                  "hover:bg-accent",
                  isActive && "bg-primary/10"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium leading-tight text-center",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
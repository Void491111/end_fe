"use client";

import { Category } from "@/types/menu";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  active: string;
  onChange: (id: string) => void;
}

export function CustomerCategoryTabs({ categories, active, onChange }: Props) {
  const items = [{ id: "all", name: "Semua" }, ...categories.map((c) => ({ id: c.id, name: c.name }))];

  return (
    <nav className="sticky top-[64px] z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
        {items.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap",
              active === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
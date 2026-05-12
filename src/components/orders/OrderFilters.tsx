"use client";

import { cn } from "@/lib/utils";

export type OrderFilter = "all" | "completed" | "voided";

interface OrderFiltersProps {
    active: OrderFilter;
    onChange: (filter: OrderFilter) => void;
    counts: {
        all: number;
        completed: number;
        voided: number;
    };
}

export function OrderFilters({ active, onChange, counts }: OrderFiltersProps) {
    const filters: { value: OrderFilter; label: string } [] = [
        { value: "all", label: "Semua" },
        { value: "completed", label: "Completed" },
        { value: "voided", label: "Voided" },
    ];

    return (
        <div className="flex gap-1 rounded-lg bg-secondary/50 p-1">
            {filters.map((filter) => {
                const isActive = active === filter.value;
                const count = counts[filter.value];

                return (
                    <button 
                        key={filter.value}
                        onClick={() => onChange(filter.value)}
                        className={cn(
                            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
                            isActive
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {filter.label}
                        <span
                            className={cn(
                                "ml-1.5 rounded-full px-1.5 py-0.5 text-xs",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
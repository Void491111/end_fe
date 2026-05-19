"use client";

import { ArrowDownUp, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type SortOption = "newest" | "oldest" | "highest" | "lowest" | "status";

interface OrderSortProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "highest", label: "Revenue Tertinggi" },
  { value: "lowest", label: "Revenue Terendah" },
  { value: "status", label: "By Status" },
];

export function OrderSort({ value, onChange }: OrderSortProps) {
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Sort";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors cursor-pointer"
        >
          <ArrowDownUp className="h-4 w-4" />
          <span>{currentLabel}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center justify-between"
          >
            <span>{option.label}</span>
            <Check
              className={cn(
                "h-4 w-4",
                value === option.value ? "opacity-100" : "opacity-0"
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper: sort orders
export function sortOrders<T extends { createdAt: string; total: number; status: string }>(
  orders: T[],
  sortBy: SortOption
): T[] {
  const sorted = [...orders];

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "highest":
      return sorted.sort((a, b) => b.total - a.total);
    case "lowest":
      return sorted.sort((a, b) => a.total - b.total);
    case "status":
      return sorted.sort((a, b) => a.status.localeCompare(b.status));
    default:
      return sorted;
  }
}
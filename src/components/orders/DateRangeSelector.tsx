"use client";

import { cn } from "@/lib/utils";

export type DateRange = "today" | "7days" | "30days" | "90days";

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const RANGES: { value: DateRange; label: string }[] = [
  { value: "today", label: "Hari Ini" },
  { value: "7days", label: "7 Hari" },
  { value: "30days", label: "30 Hari" },
  { value: "90days", label: "90 Hari" },
];

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            value === range.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

// Helper: convert range ke jumlah hari
export function getDaysFromRange(range: DateRange): number {
  switch (range) {
    case "today":
      return 0;
    case "7days":
      return 7;
    case "30days":
      return 30;
    case "90days":
      return 90;
  }
}

// Helper: cek apakah date masuk dalam range
export function isInRange(date: Date, range: DateRange): boolean {
  const now = new Date();
  
  if (range === "today") {
    return date.toDateString() === now.toDateString();
  }
  
  const days = getDaysFromRange(range);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  
  return date >= cutoff;
}
"use client";

import { Clock, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { visualOf, fmtTime, rupiah, parseCustom } from "@/lib/queueStatus";
import type { CashierOrder } from "@/hooks/useCashierOrders";

interface CashierOrderCardProps {
  order: CashierOrder;
  onSelect: (order: CashierOrder) => void;
}

export function CashierOrderCard({ order, onSelect }: CashierOrderCardProps) {
  const v = visualOf(order.order_type);
  const custom = parseCustom(order.custom);
  const totalItems = order.items.reduce((n, it) => n + it.quantity, 0);
  const shown = order.items.slice(0, 3);
  const more = order.items.length - shown.length;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(order)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(order);
        }
      }}
      className={cn(
        "group flex w-65 shrink-0 cursor-pointer snap-start flex-col rounded-xl border p-4 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        v.container,
        v.containerHover,
      )}
    >
      {/* Header: nomor antrian + badge tipe order */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Antrian</p>
          <p className="text-2xl font-bold leading-none tracking-tight">
            {order.queue_number}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            v.badge,
          )}
        >
          <v.icon className="h-3.5 w-3.5" />
          {v.label}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 shrink-0" />
        <span>{fmtTime(order.created_at)}</span>
      </div>

      {/* Item + kustomisasi */}
      <div className="mt-3 rounded-lg bg-background/60 px-3 py-2">
        <div className="flex items-center justify-between">
          <p className={cn("text-xs font-semibold", v.accent)}>
            {totalItems} item
          </p>
          {custom.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              <Sparkles className="h-3 w-3" />
              custom
            </span>
          )}
        </div>

        <ul className="mt-1.5 space-y-0.5">
          {shown.map((it, i) => (
            <li key={i} className="truncate text-sm text-foreground/85">
              {it.name} &times;{it.quantity}
            </li>
          ))}
        </ul>

        {more > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">+{more} lainnya</p>
        )}

        {custom.length > 0 && (
          <p className="mt-1.5 line-clamp-2 border-l-2 border-amber-400 pl-2 text-xs italic text-amber-700 dark:text-amber-300">
            {custom.join(" \u00b7 ")}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold">{rupiah(order.total)}</span>
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          Detail <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
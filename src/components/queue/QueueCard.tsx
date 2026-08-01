"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, User, ChevronRight, Check, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { visualOf, bucketOf, fmtTime, parseItemNotes } from "@/lib/queueStatus";
import type { QueueOrder } from "@/hooks/useQrQueue";

interface QueueCardProps {
  order: QueueOrder;
  busy: boolean;
  onSelect: (order: QueueOrder) => void;
  onFinish: (order: QueueOrder) => void;
}

export function QueueCard({ order, busy, onSelect, onFinish }: QueueCardProps) {
  const v = visualOf(order.status);
  const isDone = bucketOf(order.status) === "done";
  const totalItems = order.items.reduce((n, it) => n + it.quantity, 0);
  const notes = parseItemNotes(order.notes);
  const noteCount =
    Object.keys(notes.byMenu).length + notes.general.length;

  // item yang ada catatannya naik ke atas — itu yang paling gampang kelewat kasir
  const sorted = [...order.items].sort(
    (a, b) => Number(!!notes.byMenu[b.name]) - Number(!!notes.byMenu[a.name]),
  );
  const shown = sorted.slice(0, 3);
  const more = sorted.length - shown.length;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onClick={() => onSelect(order)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(order);
        }
      }}
      className={cn(
        "group flex w-full cursor-pointer flex-col rounded-xl border p-4 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        v.container,
        v.containerHover,
      )}
    >
      {/* Header: nomor antrian + badge status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Antrian</p>
          <p className="text-2xl font-bold leading-none tracking-tight">
            {order.queue_number}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            v.badge,
          )}
        >
          <v.icon className="h-3.5 w-3.5" />
          {v.label}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 space-y-1.5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>{fmtTime(order.created_at)}</span>
          {order.table_code && (
            <>
              <MapPin className="ml-1 h-4 w-4 shrink-0" />
              <span>Meja {order.table_code}</span>
            </>
          )}
        </div>
        {order.customer_name && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">{order.customer_name}</span>
          </div>
        )}
      </div>

      {/* Ringkasan item + catatan per item */}
      <div className="mt-3 rounded-lg bg-background/60 px-3 py-2">
        <div className="flex items-center justify-between">
          <p className={cn("text-xs font-semibold", v.accent)}>
            {totalItems} item
          </p>
          {noteCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              <StickyNote className="h-3 w-3" />
              {noteCount} catatan
            </span>
          )}
        </div>

        <ul className="mt-1.5 space-y-1">
          {shown.map((it, i) => {
            const note = notes.byMenu[it.name];
            return (
              <li key={i} className="text-sm leading-snug">
                <span className="text-foreground/85">
                  {it.name} ×{it.quantity}
                </span>
                {note && (
                  <span className="mt-0.5 block border-l-2 border-amber-400 pl-2 text-xs italic text-amber-700 dark:text-amber-300">
                    {note}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {more > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            +{more} item lainnya
          </p>
        )}

        {notes.general.length > 0 && (
          <p className="mt-1.5 border-l-2 border-amber-400 pl-2 text-xs italic text-amber-700 dark:text-amber-300">
            {notes.general.join(" · ")}
          </p>
        )}
      </div>

      {/* Footer aksi */}
      <div className="mt-4 flex items-center justify-between">
        {isDone ? (
          <span className={cn("text-xs font-medium", v.accent)}>
            Selesai {fmtTime(order.updated_at)}
          </span>
        ) : (
          <Button
            size="sm"
            className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              onFinish(order);
            }}
          >
            <Check className="h-4 w-4" />
            {busy ? "Memproses..." : "Tandai Selesai"}
          </Button>
        )}
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          Detail <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.div>
  );
}
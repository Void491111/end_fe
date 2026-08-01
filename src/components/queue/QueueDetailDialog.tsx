"use client";

import { Clock, MapPin, User, Check, StickyNote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { visualOf, bucketOf, fmtTime, parseItemNotes } from "@/lib/queueStatus";
import type { QueueOrder } from "@/hooks/useQrQueue";

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

interface QueueDetailDialogProps {
  order: QueueOrder | null;
  busy: boolean;
  onClose: () => void;
  onFinish: (order: QueueOrder) => void;
}

export function QueueDetailDialog({
  order,
  busy,
  onClose,
  onFinish,
}: QueueDetailDialogProps) {
  if (!order) return null;
  const v = visualOf(order.status);
  const isDone = bucketOf(order.status) === "done";
  const notes = parseItemNotes(order.notes);

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-xl">
              Antrian {order.queue_number}
            </DialogTitle>
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
        </DialogHeader>

        {/* Meta */}
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Masuk {fmtTime(order.created_at)}</span>
            {isDone && (
              <span className={v.accent}>· Selesai {fmtTime(order.updated_at)}</span>
            )}
          </div>
          {order.table_code && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Meja {order.table_code}</span>
            </div>
          )}
          {order.customer_name && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0" />
              <span>{order.customer_name}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Item lengkap */}
        <ul className="space-y-2.5">
          {order.items.map((it, i) => {
            const note = notes.byMenu[it.name];
            return (
              <li key={i} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/90">{it.name}</span>
                  <span className="font-semibold">×{it.quantity}</span>
                </div>
                {note && (
                  <p className="mt-1 border-l-2 border-amber-400 pl-2 text-xs italic text-amber-700 dark:text-amber-300">
                    {note}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        {notes.general.length > 0 && (
          <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
            <StickyNote className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Catatan tambahan
              </p>
              {notes.general.map((g, i) => (
                <p key={i} className="text-foreground/80">
                  {g}
                </p>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-bold">{rupiah(order.total)}</span>
        </div>

        {!isDone && (
          <Button
            className="w-full gap-1.5 bg-green-600 text-white hover:bg-green-700"
            disabled={busy}
            onClick={() => onFinish(order)}
          >
            <Check className="h-4 w-4" />
            {busy ? "Memproses..." : "Tandai Selesai"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
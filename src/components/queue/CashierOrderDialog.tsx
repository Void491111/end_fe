"use client";

import { Clock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { visualOf, fmtTime, rupiah, parseCustom } from "@/lib/queueStatus";
import type { CashierOrder } from "@/hooks/useCashierOrders";

interface CashierOrderDialogProps {
  order: CashierOrder | null;
  onClose: () => void;
}

export function CashierOrderDialog({ order, onClose }: CashierOrderDialogProps) {
  if (!order) return null;
  const v = visualOf(order.order_type);
  const custom = parseCustom(order.custom);

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

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Dipesan {fmtTime(order.created_at)}</span>
        </div>

        <Separator />

        <ul className="space-y-2">
          {order.items.map((it, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-foreground/90">{it.name}</span>
              <span className="font-semibold">&times;{it.quantity}</span>
            </li>
          ))}
        </ul>

        {custom.length > 0 && (
          <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Kustomisasi
              </p>
              {custom.map((c, i) => (
                <p key={i} className="text-foreground/80">
                  {c}
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
      </DialogContent>
    </Dialog>
  );
}
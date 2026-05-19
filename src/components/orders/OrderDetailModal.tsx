"use client";

import { useState } from "react";
import { Clock, User, ShoppingBag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrderStore } from "@/store/useOrderStatus";
import { CompletedOrder } from "@/types/order";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface OrderDetailModalProps {
  order: CompletedOrder | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const voidOrder = useOrderStore((s) => s.voidOrder);
  const [showConfirmVoid, setShowConfirmVoid] = useState(false);

  if (!order) return null;

  const isVoided = order.status === "voided";
  const date = new Date(order.createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const handleVoid = () => {
    voidOrder(order.id);
    toast.success(`Order ${order.queueNumber} dibatalkan`);
    setShowConfirmVoid(false);
    onClose();
  };

  return (
    <Dialog open={!!order} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent variant="premium">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Order Details
            </DialogTitle>
            {isVoided && (
              <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                Voided
              </span>
            )}
          </div>
        </DialogHeader>

        {/* Queue */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Nomor Antrian
          </p>
          <p
            className={cn(
              "text-4xl font-bold mt-1",
              isVoided ? "text-muted-foreground line-through" : "text-primary"
            )}
          >
            {order.queueNumber}
          </p>
        </div>

        {/* Meta */}
        <div className="space-y-2 rounded-lg bg-secondary/30 p-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Kasir: {order.kasirName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tipe Order</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                order.orderType === "dine-in"
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-orange-500/10 text-orange-500"
              )}
            >
              {order.orderType === "dine-in" ? "Dine In" : "Takeaway"}
            </span>
          </div>
        </div>

        {/* Items */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Items ({order.items.length})
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-card border border-border p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-primary/20 to-accent">
                    ☕
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2 rounded-lg bg-secondary/30 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-primary">
              {formatCurrency(order.total)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Cash Received</span>
            <span>{formatCurrency(order.cashReceived)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Kembalian</span>
            <span>{formatCurrency(order.changeAmount)}</span>
          </div>
        </div>

        {/* Actions */}
        {!isVoided && !showConfirmVoid && (
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive hover:border-destructive/50"
            onClick={() => setShowConfirmVoid(true)}
          >
            Void Order
          </Button>
        )}

        {showConfirmVoid && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-destructive">
                  Void order ini?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Aksi ini tidak bisa dibatalkan
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowConfirmVoid(false)}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={handleVoid}
              >
                Ya, Void
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
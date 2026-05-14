"use client";

import { useState } from "react";
import { Loader2, Banknote, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStatus"
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency } from "@/lib/format";
import { CompletedOrder } from "@/types/order";
import { cn } from "@/lib/utils";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_AMOUNTS = [20000, 50000, 100000];

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {open && <CheckoutContent onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

function CheckoutContent({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const tax = useCartStore((s) => s.getTax());
  const total = useCartStore((s) => s.getTotal());
  const orderType = useCartStore((s) => s.orderType);
  const clearCart = useCartStore((s) => s.clearCart);

  const addOrder = useOrderStore((s) => s.addOrder);
  const getNextQueueNumber = useOrderStore((s) => s.getNextQueueNumber);
  const user = useAuthStore((s) => s.user);

  const [cashInput, setCashInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successQueue, setSuccessQueue] = useState<string | null>(null);

  const cashReceived = Number(cashInput) || 0;
  const changeAmount = cashReceived - total;
  const isPaymentValid = cashReceived >= total;

  const handleQuickAmount = (amount: number) => {
    setCashInput(String(amount));
  };

  const handleExactAmount = () => {
    setCashInput(String(Math.ceil(total)));
  };

  const handleSubmit = async () => {
    if (!isPaymentValid) {
      toast.error("Uang tidak cukup");
      return;
    }

    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const queueNumber = getNextQueueNumber();
    const newOrder: CompletedOrder = {
      id: `ORD-${Date.now()}`,
      queueNumber,
      items: [...items],
      subtotal,
      tax,
      total,
      cashReceived,
      changeAmount,
      paymentMethod: "cash",
      orderType,
      status: "Completed",
      kasirName: user?.name ?? "Person 1",
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);
    clearCart();
    setSuccessQueue(queueNumber);
    setIsProcessing(false);
    toast.success(`Order ${queueNumber} berhasil!`);
  };

  const handleNewOrder = () => {
    onOpenChange(false);
  };

  return (
    <AnimatePresence mode="wait">
      {!successQueue ? (
        <motion.div
          key="checkout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-6"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Checkout
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2 rounded-lg bg-secondary/50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({items.length} items)
                </span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cash">Uang Diterima</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  Rp
                </span>
                <Input
                  id="cash"
                  type="number"
                  placeholder="0"
                  value={cashInput}
                  onChange={(e) => setCashInput(e.target.value)}
                  className="pl-9 text-lg font-semibold"
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(amount)}
                  disabled={isProcessing}
                  className="text-xs"
                >
                  {amount >= 1000 ? `${amount / 1000}k` : amount}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExactAmount}
                disabled={isProcessing}
                className="text-xs"
              >
                Pas
              </Button>
            </div>

            <div
              className={cn(
                "rounded-lg p-4 transition-colors",
                cashReceived === 0
                  ? "bg-secondary/50"
                  : isPaymentValid
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-destructive/10 border border-destructive/20"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Kembalian</span>
                <span
                  className={cn(
                    "text-xl font-bold",
                    cashReceived === 0
                      ? "text-muted-foreground"
                      : isPaymentValid
                      ? "text-primary"
                      : "text-destructive"
                  )}
                >
                  {cashReceived === 0
                    ? formatCurrency(0)
                    : !isPaymentValid
                    ? `Kurang ${formatCurrency(Math.abs(changeAmount))}`
                    : formatCurrency(changeAmount)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={handleSubmit}
              disabled={!isPaymentValid || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Konfirmasi Pembayaran"
              )}
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", duration: 0.5 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
          >
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </motion.div>

          <h2 className="text-xl font-bold">Pembayaran Berhasil!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Order telah berhasil disimpan
          </p>

          <div className="my-6 rounded-lg bg-secondary/50 p-4">
            <p className="text-xs text-muted-foreground">Nomor Antrian</p>
            <p className="text-4xl font-bold text-primary mt-1">
              {successQueue}
            </p>
          </div>

          <div className="space-y-2 text-sm text-left rounded-lg bg-secondary/30 p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cash</span>
              <span>{formatCurrency(cashReceived)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kembalian</span>
              <span className="font-semibold text-primary">
                {formatCurrency(changeAmount)}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            onClick={handleNewOrder}
          >
            Order Baru
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
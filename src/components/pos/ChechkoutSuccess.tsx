"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

interface CheckoutSuccessProps {
  queueNumber: string;
  total: number;
  cashReceived: number;
  changeAmount: number;
  onNewOrder: () => void;
}

export function CheckoutSuccess({
  queueNumber,
  total,
  cashReceived,
  changeAmount,
  onNewOrder,
}: CheckoutSuccessProps) {
  return (
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
        <p className="text-4xl font-bold text-primary mt-1">{queueNumber}</p>
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
        onClick={onNewOrder}
      >
        Order Baru
      </Button>
    </motion.div>
  );
}
"use client";

import { Loader2, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentSummary } from "./PaymentSummary";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [20000, 50000, 100000];

interface CheckoutFormProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  cashInput: string;
  cashReceived: number;
  changeAmount: number;
  isPaymentValid: boolean;
  isProcessing: boolean;
  onCashChange: (value: string) => void;
  onQuickAmount: (amount: number) => void;
  onExactAmount: () => void;
  onSubmit: () => void;
}

export function CheckoutForm({
  subtotal,
  tax,
  total,
  itemCount,
  cashInput,
  cashReceived,
  changeAmount,
  isPaymentValid,
  isProcessing,
  onCashChange,
  onQuickAmount,
  onExactAmount,
  onSubmit,
}: CheckoutFormProps) {
  return (
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
        <PaymentSummary
          subtotal={subtotal}
          tax={tax}
          total={total}
          itemCount={itemCount}
        />

        {/* Cash Input */}
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
              onChange={(e) => onCashChange(e.target.value)}
              className="pl-9 text-lg font-semibold"
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Quick Amounts */}
        <div className="grid grid-cols-4 gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onQuickAmount(amount)}
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
            onClick={onExactAmount}
            disabled={isProcessing}
            className="text-xs"
          >
            Pas
          </Button>
        </div>

        {/* Change Display */}
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

        {/* Submit */}
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          onClick={onSubmit}
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
  );
}
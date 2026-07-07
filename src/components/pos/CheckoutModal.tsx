"use client";

import { AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCheckout } from "@/hooks/useCheckout";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutSuccess } from "./ChechkoutSuccess";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="premium">
        {open && <CheckoutContent onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function CheckoutContent({ onClose }: { onClose: () => void }) {
  const checkout = useCheckout();

  return (
    <AnimatePresence mode="wait">
      {!checkout.successQueue ? (
        <CheckoutForm
          subtotal={checkout.subtotal}
          tax={checkout.tax}
          total={checkout.total}
          itemCount={checkout.items.length}
          cashInput={checkout.cashInput}
          cashReceived={checkout.cashReceived}
          changeAmount={checkout.changeAmount}
          isPaymentValid={checkout.isPaymentValid}
          isProcessing={checkout.isProcessing}
          onCashChange={checkout.setCashInput}
          onQuickAmount={checkout.setQuickAmount}
          onExactAmount={checkout.setExactAmount}
          onSubmit={checkout.submitOrder}
        />
      ) : (
        <CheckoutSuccess
          queueNumber={checkout.successQueue}
          total={checkout.total}
          cashReceived={checkout.cashReceived}
          changeAmount={checkout.changeAmount}
          onNewOrder={onClose}
        />
      )}
    </AnimatePresence>
  );
}
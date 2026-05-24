"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { useHydration } from "@/hooks/useHydration";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemRow } from "./CartItem";
import { OrderSummary } from "./OrderSummary";
import { OrderTypeToggle } from "./OrderTypeToggle";
import { CheckoutModal } from "./CheckoutModal.tsx";
import { CartHeader } from "./CartHeader";
import { ClearCartDialog } from "./ClearCartDialog";

export function CartPanel() {
  const hydrated = useHydration();

  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.getItemCount());
  const clearCart = useCartStore((s) => s.clearCart);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const displayItems = hydrated ? items : [];
  const displayCount = hydrated ? itemCount : 0;

  const handleConfirmClear = () => {
    clearCart();
    setConfirmClearOpen(false);
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    if (displayItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <>
      <aside className="h-full flex w-95 flex-col border-l border-border bg-card">
        <CartHeader
          itemCount={displayCount}
          hasItems={displayItems.length > 0}
          onClearClick={() => setConfirmClearOpen(true)}
        />

        <div className="border-b border-border p-4">
          <OrderTypeToggle />
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            {displayItems.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {displayItems.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4 space-y-3">
          <OrderSummary />
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            onClick={handleCheckout}
            disabled={displayItems.length === 0}
          >
            Checkout · {displayCount} {displayCount === 1 ? "item" : "items"}
          </Button>
        </div>
      </aside>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />

      <ClearCartDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        itemCount={displayCount}
        onConfirm={handleConfirmClear}
      />
    </>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold">Your cart is empty</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Add items from the menu to get started
      </p>
    </div>
  );
}
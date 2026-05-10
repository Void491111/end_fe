"use client";

import { useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemRow } from "./CartItem";
import { OrderSummary } from "./OrderSummary";
import { OrderTypeToggle } from "./OrderTypeToggle";
import { CheckoutModal } from "./CheckoutModal.tsx"

export function CartPanel() {
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.getItemCount());
  const clearCart = useCartStore((s) => s.clearCart);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleClear = () => {
    if (items.length === 0) return;
    clearCart();
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <>
      <aside className="flex w-[380px] flex-col border-l border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Order Details</h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {itemCount}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="border-b border-border p-4">
          <OrderTypeToggle />
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {items.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
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
            disabled={items.length === 0}
          >
            Checkout · {itemCount} {itemCount === 1 ? "item" : "items"}
          </Button>
        </div>
      </aside>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
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
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useCustomerCartStore } from "@/store/useCustomerCartStore";
import { useHydration } from "@/hooks/useHydration";

interface Props {
  onOpen: () => void;
}

export function CustomerCartBar({ onOpen }: Props) {
  const hydrated = useHydration();
  const itemCount = useCustomerCartStore((s) => s.getItemCount());
  const total = useCustomerCartStore((s) => s.getTotal());

  if (!hydrated || itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg shadow-2xl"
      >
        <button
          onClick={onOpen}
          className="w-full flex items-center gap-3 px-4 py-3 active:bg-accent/50 transition-colors"
        >
          {/* Icon + count */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground border-2 border-background">
              {itemCount}
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs text-muted-foreground leading-tight">
              {itemCount} item · Total
            </p>
            <p className="text-base font-bold leading-tight text-foreground">
              {formatCurrency(total)}
            </p>
          </div>

          {/* CTA */}
          <div className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shrink-0">
            Lihat Pesanan
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { CompletedOrder } from "@/types/order";
import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: CompletedOrder;
  onClick: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const time = new Date(order.createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const isVoided = order.status === "voided";

  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      <Card
        onClick={onClick}
        className={cn(
          "cursor-pointer p-4 transition-all hover:border-primary/50 hover:shadow-md",
          isVoided && "opacity-60"
        )}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Queue Number */}
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-bold",
              isVoided
                ? "bg-muted text-muted-foreground"
                : "bg-primary/10 text-primary"
            )}
          >
            {order.queueNumber}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </h3>
              {isVoided && (
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  Voided
                </span>
              )}
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
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{time}</span>
              <span>·</span>
              <span>{order.kasirName}</span>
            </div>
          </div>

          {/* Amount */}
          <div className="text-right">
            <p
              className={cn(
                "font-bold",
                isVoided ? "text-muted-foreground line-through" : "text-primary"
              )}
            >
              {formatCurrency(order.total)}
            </p>
            <p className="text-xs text-muted-foreground">Cash</p>
          </div>

          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
      </Card>
    </motion.div>
  );
}
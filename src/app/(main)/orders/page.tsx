"use client";

import { useState, useMemo } from "react";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderDetailModal } from "@/components/orders/OrderDetailModal";
import { OrderStats } from "@/components/orders/OrderStats";
import {
  OrderFilters,
  OrderFilter,
} from "@/components/orders/OrderFilters";
import { useOrderStore } from "@/store/useOrderStatus";
import { CompletedOrder } from "@/types/order";
import { toast } from "sonner";

export default function OrdersPage() {
  const allOrders = useOrderStore((s) => s.orders);

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString();
    return allOrders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );
  }, [allOrders]);

  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(
    null
  );
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      all: todayOrders.length,
      completed: todayOrders.filter((o) => o.status === "Completed").length,
      voided: todayOrders.filter((o) => o.status === "voided").length,
    }),
    [todayOrders]
  );

  const filteredOrders = useMemo(() => {
    return todayOrders
      .filter((o) => {
        if (filter === "all") return true;
        return o.status === filter;
      })
      .filter((o) => {
        if (!search) return true;
        return o.queueNumber.toLowerCase().includes(search.toLowerCase());
      });
  }, [todayOrders, filter, search]);

  const handleRefresh = () => {
    toast.success("Order list refreshed");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-sm text-muted-foreground">
              Riwayat pesanan hari ini
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4 max-w-5xl mx-auto">
          <OrderStats />

          <div className="space-y-3">
            <OrderFilters
              active={filter}
              onChange={setFilter}
              counts={counts}
            />
            <Input
              placeholder="Search by queue number (e.g. A001)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <EmptyState hasOrders={todayOrders.length > 0} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

function EmptyState({ hasOrders }: { hasOrders: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">
        {hasOrders ? "No orders match" : "Belum ada order hari ini"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-xs">
        {hasOrders
          ? "Coba ubah filter atau search query"
          : "Order pertama akan muncul di sini setelah checkout"}
      </p>
    </div>
  );
}
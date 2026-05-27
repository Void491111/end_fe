"use client";

import { useState } from "react";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderDetailModal } from "@/components/orders/OrderDetailModal";
import { OrderSort } from "@/components/orders/OrderSort";
import { OrderStats } from "@/components/orders/OrderStats";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { DateRangeSelector } from "@/components/orders/DateRangeSelector";
import { useOrderHistory } from "@/hooks/useOrderHistory";
import { getRangeLabel } from "@/lib/orderHelper";
import { CompletedOrder } from "@/types/order";

export default function OrdersPage() {
  const {
    rangedOrders,
    filteredOrders,
    counts,
    dateRange,
    sortBy,
    filter,
    search,
    setDateRange,
    setSortBy,
    setFilter,
    setSearch,
  } = useOrderHistory();

  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(
    null
  );

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-sm text-muted-foreground">
              {getRangeLabel(dateRange)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Order list refreshed")}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <DateRangeSelector value={dateRange} onChange={setDateRange} />
            <OrderSort value={sortBy} onChange={setSortBy} />
          </div>

          <OrderStats orders={rangedOrders} />

          <div className="space-y-3">
            <OrderFilters active={filter} onChange={setFilter} counts={counts} />
            <Input
              placeholder="Search by queue number (e.g. A001)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <EmptyState hasOrders={rangedOrders.length > 0} />
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
      </div>

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
        {hasOrders ? "No orders match" : "Belum ada order di periode ini"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-xs">
        {hasOrders
          ? "Coba ubah filter atau search query"
          : "Pilih range waktu lain atau buat order baru"}
      </p>
    </div>
  );
}
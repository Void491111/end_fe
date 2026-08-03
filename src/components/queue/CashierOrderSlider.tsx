"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCashierOrders, type CashierOrder } from "@/hooks/useCashierOrders";
import { CashierOrderCard } from "@/components/queue/CashierOrderCard";
import { CashierOrderDialog } from "@/components/queue/CashierOrderDialog";

export function CashierOrderSlider() {
  const { orders, loading, refresh } = useCashierOrders();
  const [selected, setSelected] = useState<CashierOrder | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // geser ~1 kartu + gap
  const scrollBy = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * 276, behavior: "smooth" });

  return (
    <section className="p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Pesanan Hari Ini</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
           {`${orders.length} pesanan kasir · geser untuk lihat yang lain`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon" onClick={() => scrollBy(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scrollBy(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw
              className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
          </Button>
        </div>
      </div>

      {loading && orders.length === 0 && (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-52 w-65 shrink-0 animate-pulse rounded-xl border border-border bg-muted/40"
            />
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
          <Inbox className="h-9 w-9 text-muted-foreground" />
          <p className="mt-3 font-medium">Belum ada pesanan hari ini</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pesanan yang di-checkout di kasir bakal muncul di sini.
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
        >
          {orders.map((order) => (
            <CashierOrderCard
              key={order.id}
              order={order}
              onSelect={setSelected}
            />
          ))}
        </div>
      )}

      <CashierOrderDialog order={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
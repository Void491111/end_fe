"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RefreshCw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQrQueue, type QueueOrder } from "@/hooks/useQrQueue";
import { QueueCard } from "@/components/queue/QueueCard";
import { QueueDetailDialog } from "@/components/queue/QueueDetailDialog";

export function QueueBoard() {
  const { orders, active, done, loading, busyId, activeCount, doneCount, finish, refresh } =
    useQrQueue();
  const [selected, setSelected] = useState<QueueOrder | null>(null);

  const handleFinish = (order: QueueOrder) => {
    finish(order);
    setSelected(null);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Antrian Pesanan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeCount} belum selesai · {doneCount} selesai hari ini
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && orders.length === 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-xl border border-border bg-muted/40"
            />
          ))}
        </div>
      )}

      {/* Kosong */}
      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-medium">Belum ada pesanan masuk</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pesanan dari QR meja pelanggan bakal muncul di sini otomatis.
          </p>
        </div>
      )}

      {/* Grid — aktif dulu (FIFO), lalu selesai */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {[...active, ...done].map((order) => (
              <QueueCard
                key={order.id}
                order={order}
                busy={busyId === order.id}
                onSelect={setSelected}
                onFinish={handleFinish}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <QueueDetailDialog
        order={selected}
        busy={selected ? busyId === selected.id : false}
        onClose={() => setSelected(null)}
        onFinish={handleFinish}
      />
    </div>
  );
}
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { queueApi } from "@/lib/api";
import { bucketOf, type QueueStatus } from "@/lib/queueStatus";

export interface QueueItem {
  name: string;
  quantity: number;
}

export interface QueueOrder {
  id: number;
  queue_number: string;
  table_code: string | null;
  customer_name: string | null;
  status: QueueStatus;
  total: number;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  items: QueueItem[];
}

export function useQrQueue(pollMs = 8000) {
  const [orders, setOrders] = useState<QueueOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await queueApi.list();
      setOrders(res.data.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timer.current = setInterval(load, pollMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [load, pollMs]);

  const act = useCallback(
    async (id: number, fn: () => Promise<unknown>) => {
      setBusyId(id);
      try {
        await fn();
        await load();
      } finally {
        setBusyId(null);
      }
    },
    [load],
  );

  /**
   * 1 klik "Tandai Selesai".
   * BE maksa transisi paid -> preparing -> completed, jadi kalau order masih
   * paid kita confirm dulu baru complete. Kasir cuma liat 1 tombol.
   */
  const finish = useCallback(
    (order: QueueOrder) =>
      act(order.id, async () => {
        if (order.status === "paid") {
          await queueApi.confirm(order.id);
        }
        await queueApi.complete(order.id);
      }),
    [act],
  );

  // aktif: urutan masuk (FIFO). selesai: yg terbaru di atas.
  const active = useMemo(
    () => orders.filter((o) => bucketOf(o.status) === "active"),
    [orders],
  );
  const done = useMemo(
    () => orders.filter((o) => bucketOf(o.status) === "done"),
    [orders],
  );

  return {
    orders,
    active,
    done,
    loading,
    busyId,
    activeCount: active.length,
    doneCount: done.length,
    finish,
    reject: (id: number, reason: string) =>
      act(id, () => queueApi.reject(id, reason)),
    refresh: load,
  };
}
import { useCallback, useEffect, useRef, useState } from "react";
import { queueApi } from "@/lib/api";

export interface QueueItem { name: string; quantity: number; }
export interface QueueOrder {
  id: number;
  queue_number: string;
  table_code: string | null;
  customer_name: string | null;
  status: "paid" | "preparing";
  total: number;
  notes: string | null;
  created_at: string;
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
      try { await fn(); await load(); }
      finally { setBusyId(null); }
    },
    [load]
  );

  return {
    orders,
    loading,
    busyId,
    paidCount: orders.filter((o) => o.status === "paid").length,
    confirm:  (id: number) => act(id, () => queueApi.confirm(id)),
    complete: (id: number) => act(id, () => queueApi.complete(id)),
    reject:   (id: number, reason: string) => act(id, () => queueApi.reject(id, reason)),
    refresh:  load,
  };
}
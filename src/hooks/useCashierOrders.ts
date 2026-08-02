import { useCallback, useEffect, useRef, useState } from "react";
import { orderApi } from "@/lib/api";

export interface CashierOrderItem {
  name: string;
  quantity: number;
}

export interface CashierOrder {
  id: number;
  queue_number: string;
  order_type: string;
  total: number;
  created_at: string;
  /** string kustomisasi gabungan dari BE, null kalau semua default */
  custom: string | null;
  items: CashierOrderItem[];
}

/**
 * Order kasir hari ini, terbaru duluan.
 * Polling ringan biar kalau ada 2 device kasir tetep kesinkron.
 */
export function useCashierOrders(pollMs = 15000) {
  const [orders, setOrders] = useState<CashierOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await orderApi.cashierRecent();
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

  return { orders, loading, refresh: load };
}
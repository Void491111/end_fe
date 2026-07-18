"use client";

import { useEffect, useState, useRef } from "react";
import { publicOrderApi } from "@/lib/api";

// Order status enum mirror dari backend
export type OrderStatusValue =
  | "pending_payment"
  | "paid"
  | "preparing"
  | "completed"
  | "voided"
  | "expired";

export type PaymentStatusValue =
  | "unpaid"
  | "pending"
  | "settlement"
  | "expired"
  | "failed";

export interface OrderStatusItem {
  menu_name: string;
  quantity: number;
  subtotal: number;
}

export interface OrderStatusData {
  id: number;
  queue_number: string;
  status: OrderStatusValue;
  payment_status: PaymentStatusValue;
  total: number;
  customer_name: string;
  table: { code: string; name: string } | null;
  items: OrderStatusItem[];
  created_at: string;
  paid_at: string | null;
}

// State terminal — polling berhenti kalau nyampe sini
const TERMINAL_STATES: OrderStatusValue[] = ["completed", "voided", "expired"];

const POLL_INTERVAL = 5000; // 5 detik

interface State {
  order: OrderStatusData | null;
  isLoading: boolean;
  notFound: boolean;
  error: string | null;
}

export function useOrderStatus(orderId: number | null) {
  const [state, setState] = useState<State>({
    order: null,
    isLoading: true,
    notFound: false,
    error: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    if (!orderId) return;
    aliveRef.current = true;

    const fetchStatus = async () => {
      try {
        const res = await publicOrderApi.status(orderId);
        if (!aliveRef.current) return;

        const order = res.data as OrderStatusData;

        setState({
          order,
          isLoading: false,
          notFound: false,
          error: null,
        });

        // Kalau belum terminal, schedule next poll
        if (!TERMINAL_STATES.includes(order.status)) {
          timerRef.current = setTimeout(fetchStatus, POLL_INTERVAL);
        }
      } catch (err: any) {
        if (!aliveRef.current) return;

        const status = err?.response?.status;
        setState({
          order: null,
          isLoading: false,
          notFound: status === 404,
          error: err?.response?.data?.message || "Gagal load status pesanan",
        });

        // Network error → retry, 404 → stop
        if (status !== 404) {
          timerRef.current = setTimeout(fetchStatus, POLL_INTERVAL);
        }
      }
    };

    fetchStatus();

    return () => {
      aliveRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [orderId]);

  return state;
}
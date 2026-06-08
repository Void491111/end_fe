"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useCartStore } from "@/store/useCartStore";
import { orderApi } from "@/lib/api";

export function useCheckout() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const tax = useCartStore((s) => s.getTax());
  const liveTotal = useCartStore((s) => s.getTotal());
  const orderType = useCartStore((s) => s.orderType);
  const clearCart = useCartStore((s) => s.clearCart);

  const [cashInput, setCashInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successQueue, setSuccessQueue] = useState<string | null>(null);

  // Snapshot values saat order ke-submit, biar success screen ga ke-reset ke 0 abis clearCart
  const [snapshot, setSnapshot] = useState({
    total: 0,
    cashReceived: 0,
    changeAmount: 0,
  });

  const liveCashReceived = Number(cashInput) || 0;
  const liveChangeAmount = liveCashReceived - liveTotal;
  const isPaymentValid = liveCashReceived >= liveTotal;

  // Pake snapshot kalo success screen lagi nampil, live otherwise
  const total = successQueue ? snapshot.total : liveTotal;
  const cashReceived = successQueue ? snapshot.cashReceived : liveCashReceived;
  const changeAmount = successQueue ? snapshot.changeAmount : liveChangeAmount;

  const setQuickAmount = (amount: number) => setCashInput(String(amount));
  const setExactAmount = () => setCashInput(String(Math.ceil(liveTotal)));

  const submitOrder = async () => {
    if (!isPaymentValid) {
      toast.error("Uang tidak cukup");
      return;
    }

    if (items.length === 0) {
      toast.error("Cart kosong");
      return;
    }

    setIsProcessing(true);

    try {
      // Merge duplicate menu_ids (kalo ada same menu dgn customization beda, jumlahin quantity-nya)
      const itemMap = new Map<number, number>();
      items.forEach((item) => {
        const menuId = parseInt(item.id);
        itemMap.set(menuId, (itemMap.get(menuId) ?? 0) + item.quantity);
      });

      const apiItems = Array.from(itemMap.entries()).map(([menu_id, quantity]) => ({
        menu_id,
        quantity,
      }));

      // FE pake "dine-in", BE expect "dine_in"
      const apiOrderType = orderType === "dine-in" ? "dine_in" : "takeaway";

      // POST ke /api/orders
      const { data } = await orderApi.create({
        order_type: apiOrderType,
        items: apiItems,
      });

      // Snapshot BEFORE clearCart
      setSnapshot({
        total: liveTotal,
        cashReceived: liveCashReceived,
        changeAmount: liveChangeAmount,
      });

      setSuccessQueue(data.queue_number);
      clearCart();
      setCashInput("");
      toast.success(`Order ${data.queue_number} berhasil!`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          error.response?.data?.message ||
          error.response?.data?.errors?.items?.[0] ||
          (status === 422 ? "Data order tidak valid" : "Gagal submit order");
        toast.error(message);
      } else {
        toast.error("Terjadi kesalahan tak terduga");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    items,
    subtotal,
    tax,
    total,
    cashInput,
    cashReceived,
    changeAmount,
    isPaymentValid,
    isProcessing,
    successQueue,
    setCashInput,
    setQuickAmount,
    setExactAmount,
    submitOrder,
  };
}
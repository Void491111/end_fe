"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CompletedOrder } from "@/types/order";

export function useCheckout() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const tax = useCartStore((s) => s.getTax());
  const total = useCartStore((s) => s.getTotal());
  const orderType = useCartStore((s) => s.orderType);
  const clearCart = useCartStore((s) => s.clearCart);

  const addOrder = useOrderStore((s) => s.addOrder);
  const getNextQueueNumber = useOrderStore((s) => s.getNextQueueNumber);
  const user = useAuthStore((s) => s.user);

  const [cashInput, setCashInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successQueue, setSuccessQueue] = useState<string | null>(null);

  const cashReceived = Number(cashInput) || 0;
  const changeAmount = cashReceived - total;
  const isPaymentValid = cashReceived >= total;

  const setQuickAmount = (amount: number) => setCashInput(String(amount));
  const setExactAmount = () => setCashInput(String(Math.ceil(total)));

  const submitOrder = async () => {
    if (!isPaymentValid) {
      toast.error("Uang tidak cukup");
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const queueNumber = getNextQueueNumber();
    const newOrder: CompletedOrder = {
      id: `ORD-${Date.now()}`,
      queueNumber,
      items: [...items],
      subtotal,
      tax,
      total,
      cashReceived,
      changeAmount,
      paymentMethod: "cash",
      orderType,
      status: "completed",
      kasirName: user?.name ?? "Person 1",
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);
    clearCart();
    setSuccessQueue(queueNumber);
    setIsProcessing(false);
    toast.success(`Order ${queueNumber} berhasil!`);
  };

  return {
    // data
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
    // actions
    setCashInput,
    setQuickAmount,
    setExactAmount,
    submitOrder,
  };
}
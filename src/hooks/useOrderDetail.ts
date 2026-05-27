"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useOrderStore } from "@/store/useOrderStore";
import { CompletedOrder } from "@/types/order";

export function useOrderDetails(order: CompletedOrder | null, onClose: () => void) {
  const voidOrder = useOrderStore((s) => s.voidOrder);
  const [showConfirmVoid, setShowConfirmVoid] = useState(false);

  const isVoided = order?.status === "voided";
  
  const formattedDate = order 
    ? new Date(order.createdAt).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "";

  const handleVoid = () => {
    if (!order) return;
    voidOrder(order.id);
    toast.success(`Order ${order.queueNumber} dibatalkan`);
    setShowConfirmVoid(false);
    onClose();
  };

  return {
    isVoided,
    formattedDate,
    showConfirmVoid,
    setShowConfirmVoid,
    handleVoid,
  };
}
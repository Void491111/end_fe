"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useOrderStore } from "@/store/useOrderStore";
import { CompletedOrder } from "@/types/order";

export function useOrderDetails(
  order: CompletedOrder | null,
  onClose: () => void
) {
  const voidOrder = useOrderStore((s) => s.voidOrder);
  const [showConfirmVoid, setShowConfirmVoid] = useState(false);
  const [voidReason, setVoidReason] = useState("");
  const [isVoiding, setIsVoiding] = useState(false);

  const isVoided = order?.status === "voided";

  const formattedDate = order
    ? new Date(order.createdAt).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "";

  const handleVoid = async () => {
    if (!order) return;

    // Default reason kalo user ga isi (krn BE require min 3 char)
    const reason = voidReason.trim() || "Voided by cashier";

    setIsVoiding(true);
    try {
      await voidOrder(order.id, reason);
      toast.success(`Order ${order.queueNumber} dibatalkan`);
      setShowConfirmVoid(false);
      setVoidReason("");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal void order";
      toast.error(message);
    } finally {
      setIsVoiding(false);
    }
  };

  return {
    isVoided,
    formattedDate,
    showConfirmVoid,
    setShowConfirmVoid,
    voidReason,
    setVoidReason,
    isVoiding,
    handleVoid,
  };
}
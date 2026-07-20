"use client";
import { Check, CheckCheck, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QueueOrder } from "@/hooks/userQrQueue";

interface Props {
  order: QueueOrder;
  busy: boolean;
  onConfirm: () => void;
  onComplete: () => void;
  onReject: () => void;
}

export function QueueOrderCard({ order, busy, onConfirm, onComplete, onReject }: Props) {
  const isPaid = order.status === "paid";

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${isPaid ? "border-amber-300 bg-amber-50" : "border-blue-300 bg-blue-50"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-bold">#{order.queue_number}</div>
          <div className="text-sm text-muted-foreground">
            {order.table_code ?? "—"} · {order.customer_name ?? "Tamu"}
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${isPaid ? "bg-amber-200 text-amber-900" : "bg-blue-200 text-blue-900"}`}>
          <Clock className="h-3 w-3" />
          {isPaid ? "Menunggu" : "Diproses"}
        </span>
      </div>

      <ul className="my-3 space-y-1 text-sm">
        {order.items.map((it, i) => (
          <li key={i} className="flex justify-between">
            <span>{it.name}</span><span className="font-medium">×{it.quantity}</span>
          </li>
        ))}
      </ul>

      {order.notes && <p className="mb-3 text-xs italic text-muted-foreground">📝 {order.notes}</p>}

      <div className="flex gap-2">
        {isPaid ? (
          <Button size="sm" className="flex-1" onClick={onConfirm} disabled={busy}>
            <Check className="mr-1 h-4 w-4" /> Terima
          </Button>
        ) : (
          <Button size="sm" className="flex-1" onClick={onComplete} disabled={busy}>
            <CheckCheck className="mr-1 h-4 w-4" /> Selesai
          </Button>
        )}
        <Button size="sm" variant="destructive" onClick={onReject} disabled={busy}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
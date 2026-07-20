"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useQrQueue, type QueueOrder } from "@/hooks/useQrQueue";
import { QueueOrderCard } from "@/components/queue/QueueOrderCard";
import { RejectDialog } from "@/components/queue/RejectDialog";

export default function QueuePage() {
  const { orders, loading, busyId, confirm, complete, reject } = useQrQueue();
  const [rejectTarget, setRejectTarget] = useState<QueueOrder | null>(null);

  const doConfirm = async (o: QueueOrder) => { await confirm(o.id); toast.success(`#${o.queue_number} diterima`); };
  const doComplete = async (o: QueueOrder) => { await complete(o.id); toast.success(`#${o.queue_number} selesai`); };
  const doReject = async (reason: string) => {
    if (!rejectTarget) return;
    await reject(rejectTarget.id, reason);
    toast.success(`#${rejectTarget.queue_number} ditolak`);
    setRejectTarget(null);
  };

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-xl font-bold">Antrian Pesanan QR</h1>

      {loading ? (
        <p className="text-muted-foreground">Memuat...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          Belum ada pesanan masuk 🎉
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => (
            <QueueOrderCard
              key={o.id}
              order={o}
              busy={busyId === o.id}
              onConfirm={() => doConfirm(o)}
              onComplete={() => doComplete(o)}
              onReject={() => setRejectTarget(o)}
            />
          ))}
        </div>
      )}

      <RejectDialog
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={doReject}
        loading={busyId === rejectTarget?.id}
      />
    </div>
  );
}

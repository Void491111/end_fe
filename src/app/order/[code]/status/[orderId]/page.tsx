"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Loader2, Coffee, ArrowLeft } from "lucide-react";
import { useOrderStatus } from "@/hooks/useOrderStatus";
import { isTerminalStatus } from "@/lib/customerStatus";
import { Button } from "@/components/ui/button";
import { OrderStatusHero } from "@/components/customer/OrderStatusHero";
import { OrderQueueDisplay } from "@/components/customer/OrderQueueDisplay";
import { OrderItemsList } from "@/components/customer/OrderItemsList";
import { OrderMetaInfo } from "@/components/customer/OrderMetaInfo";
import { PaymentSimulator } from "@/components/customer/PaymentSimulator";

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ code: string; orderId: string }>;
}) {
  const { code, orderId } = use(params);
  const orderIdNum = Number(orderId);
  const { order, isLoading, notFound: orderNotFound } = useOrderStatus(
    Number.isFinite(orderIdNum) ? orderIdNum : null
  );

  if (!Number.isFinite(orderIdNum) || orderNotFound) notFound();

  if (isLoading || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const terminal = isTerminalStatus(order.status);
  const needsPayment = order.status === "pending_payment";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Coffee className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground leading-tight">Status Pesanan</p>
            <h1 className="text-base font-bold leading-tight truncate">
              {order.table?.name} · <span className="text-primary">{order.table?.code}</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 pb-24 space-y-4">
        <OrderStatusHero status={order.status} />

        {/* Payment simulator — cuma muncul saat pending_payment */}
        {needsPayment && (
          <PaymentSimulator orderId={order.id} total={Number(order.total)} />
        )}

        <OrderQueueDisplay queueNumber={order.queue_number} customerName={order.customer_name} />
        <OrderItemsList items={order.items} total={order.total} />
        <OrderMetaInfo
          createdAt={order.created_at}
          paidAt={order.paid_at}
          tableName={order.table?.name}
          tableCode={order.table?.code}
        />

        {terminal && (
          <Button asChild size="lg" className="w-full font-bold">
            <Link href={`/order/${code}`}>
              <ArrowLeft className="h-4 w-4" />
              Pesan Lagi
            </Link>
          </Button>
        )}

        {!terminal && (
          <p className="text-[11px] text-center text-muted-foreground pt-2">
            Halaman ini akan update otomatis setiap 5 detik
          </p>
        )}
      </main>
    </>
  );
}

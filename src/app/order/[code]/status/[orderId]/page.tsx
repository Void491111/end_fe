"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Loader2,
  Coffee,
  Clock,
  CheckCircle2,
  ChefHat,
  PartyPopper,
  ArrowLeft,
} from "lucide-react";
import { useOrderStatus, type OrderStatusValue } from "@/hooks/useOrderStatus";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

// Extract type alias — hindarin multi-line Record generic yg bisa bikin TSX parser bingung
type StatusConfigItem = {
  label: string;
  description: string;
  color: string;
  bg: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STATUS_CONFIG: Record<OrderStatusValue, StatusConfigItem> = {
  pending_payment: {
    label: "Menunggu Pembayaran",
    description: "Silakan bayar ke kasir untuk melanjutkan pesanan",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900",
    icon: Clock,
  },
  paid: {
    label: "Pembayaran Diterima",
    description: "Pesanan kamu segera diproses oleh dapur",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
    icon: CheckCircle2,
  },
  preparing: {
    label: "Sedang Dibuat",
    description: "Pesanan lagi disiapkan barista, sabar ya",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900",
    icon: ChefHat,
  },
  completed: {
    label: "Siap Diambil!",
    description: "Pesanan udah selesai. Silakan diambil di counter",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900",
    icon: PartyPopper,
  },
  voided: {
    label: "Pesanan Dibatalkan",
    description: "Pesanan dibatalkan. Hubungi kasir untuk info lebih lanjut",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
    icon: Clock,
  },
  expired: {
    label: "Pesanan Kadaluarsa",
    description: "Pesanan expired karena tidak ada pembayaran",
    color: "text-neutral-600 dark:text-neutral-400",
    bg: "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
    icon: Clock,
  },
};

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

  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;
  const isTerminal = ["completed", "voided", "expired"].includes(order.status);

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
        <section className={`rounded-xl border p-5 ${config.bg} transition-colors`}>
          <div className="flex items-start gap-3">
            <div className={`shrink-0 ${config.color}`}>
              <StatusIcon className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`text-lg font-bold ${config.color}`}>
                {config.label}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {config.description}
              </p>
            </div>
            {!isTerminal && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0 mt-1" />
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
            Nomor Antrian
          </p>
          <p className="text-6xl font-black text-primary mt-2 tracking-tight tabular-nums">
            {order.queue_number}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Atas nama <span className="font-semibold text-foreground">{order.customer_name}</span>
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <header className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold">Detail Pesanan</h3>
          </header>
          <div className="divide-y divide-border">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">
                    {item.menu_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.quantity}x · {formatCurrency(Number(item.subtotal) / item.quantity)}
                  </p>
                </div>
                <p className="text-sm font-bold tabular-nums shrink-0">
                  {formatCurrency(Number(item.subtotal))}
                </p>
              </div>
            ))}
          </div>
          <footer className="px-4 py-3 border-t border-border bg-muted/30">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-base font-black text-primary tabular-nums">
                {formatCurrency(Number(order.total))}
              </span>
            </div>
          </footer>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Waktu Pesan</span>
            <span className="font-medium tabular-nums">
              {new Date(order.created_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {order.paid_at && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Waktu Bayar</span>
              <span className="font-medium tabular-nums">
                {new Date(order.paid_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Meja</span>
            <span className="font-medium">
              {order.table?.name} ({order.table?.code})
            </span>
          </div>
        </section>

        {isTerminal && (
          <Button asChild size="lg" className="w-full font-bold">
            <Link href={`/order/${code}`}>
              <ArrowLeft className="h-4 w-4" />
              Pesan Lagi
            </Link>
          </Button>
        )}

        {!isTerminal && (
          <p className="text-[11px] text-center text-muted-foreground pt-2">
            Halaman ini akan update otomatis setiap 5 detik
          </p>
        )}
      </main>
    </>
  );
}

import {
  Clock,
  CheckCircle2,
  ChefHat,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import type { OrderStatusValue } from "@/hooks/useOrderStatus";

export type StatusConfigItem = {
  label: string;
  description: string;
  color: string;
  bg: string;
  icon: LucideIcon;
};

export const STATUS_CONFIG: Record<OrderStatusValue, StatusConfigItem> = {
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

const TERMINAL: OrderStatusValue[] = ["completed", "voided", "expired"];

export const isTerminalStatus = (status: OrderStatusValue): boolean =>
  TERMINAL.includes(status);

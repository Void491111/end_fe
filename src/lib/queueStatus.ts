import { Utensils, ShoppingBag, type LucideIcon } from "lucide-react";

/** order kasir cuma 2 tipe, sesuai enum BE */
export type OrderType = "dine_in" | "takeaway";

export interface TypeVisual {
  /** teks di badge */
  label: string;
  /** badge = warna kontras solid */
  badge: string;
  /** container utama = versi lite dari warna badge */
  container: string;
  /** container saat di-hover */
  containerHover: string;
  /** aksen teks/ikon */
  accent: string;
  icon: LucideIcon;
}

/**
 * Warna container ngikut warna badge, versi lite.
 * Tambah tipe order baru? cukup tambah entry di sini —
 * card otomatis ngikut, gak perlu sentuh komponen.
 */
export const TYPE_VISUAL: Record<OrderType, TypeVisual> = {
  dine_in: {
    label: "Dine In",
    badge: "bg-blue-600 text-white",
    container:
      "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
    containerHover: "hover:bg-blue-100/70 dark:hover:bg-blue-950/50",
    accent: "text-blue-600 dark:text-blue-400",
    icon: Utensils,
  },
  takeaway: {
    label: "Takeaway",
    badge: "bg-green-600 text-white",
    container:
      "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900",
    containerHover: "hover:bg-green-100/70 dark:hover:bg-green-950/50",
    accent: "text-green-600 dark:text-green-400",
    icon: ShoppingBag,
  },
};

export const visualOf = (type: string): TypeVisual =>
  TYPE_VISUAL[type === "takeaway" ? "takeaway" : "dine_in"];

/** format ISO string ke jam:menit lokal (id-ID) */
export const fmtTime = (iso: string | null): string =>
  iso
    ? new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso))
    : "-";

export const rupiah = (n: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

/**
 * BE nyimpen kustomisasi sebagai satu string gabungan:
 *   "Latte x1: No Ice, Less Sugar | Kopi Susu x2: extra shot"
 * Dipecah balik jadi array baris. Sengaja gak dicocokin per nama menu —
 * dua baris menu sama (kustomisasi beda) bakal tabrakan kalau di-match nama.
 */
export const parseCustom = (custom: string | null): string[] =>
  custom
    ? custom
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
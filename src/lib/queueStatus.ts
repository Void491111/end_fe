import { Clock, CheckCircle2, type LucideIcon } from "lucide-react";

/**
 * Status mentah dari backend queue endpoint.
 * completed masuk juga karena board nampilin pesanan selesai hari ini.
 */
export type QueueStatus = "paid" | "preparing" | "completed";

/**
 * Bucket visual — sengaja cuma 2 sesuai spec kasir:
 *  - "active" (biru): belum kelar. paid & preparing digabung, kasir gak
 *    perlu bedain "udah dibayar" vs "lagi diracik" di board ini.
 *  - "done" (hijau): udah selesai.
 */
export type QueueBucket = "active" | "done";

export const bucketOf = (status: QueueStatus): QueueBucket =>
  status === "completed" ? "done" : "active";

export interface QueueVisual {
  /** teks di badge */
  label: string;
  /** badge = warna kontras solid */
  badge: string;
  /** container utama = versi lite dari warna badge */
  container: string;
  /** container saat di-hover (sedikit lebih pekat) */
  containerHover: string;
  /** aksen teks/ikon */
  accent: string;
  icon: LucideIcon;
}

/**
 * Nurut palette yang udah dipakai di STATUS_CONFIG (customer side) biar
 * konsisten satu app. Tambah warna? cukup tambah entry di sini —
 * card & dialog otomatis ngikut, gak perlu sentuh komponen.
 */
export const QUEUE_VISUAL: Record<QueueBucket, QueueVisual> = {
  active: {
    label: "Belum Selesai",
    badge: "bg-blue-600 text-white",
    container:
      "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
    containerHover: "hover:bg-blue-100/70 dark:hover:bg-blue-950/50",
    accent: "text-blue-600 dark:text-blue-400",
    icon: Clock,
  },
  done: {
    label: "Selesai",
    badge: "bg-green-600 text-white",
    container:
      "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900",
    containerHover: "hover:bg-green-100/70 dark:hover:bg-green-950/50",
    accent: "text-green-600 dark:text-green-400",
    icon: CheckCircle2,
  },
};

export const visualOf = (status: QueueStatus): QueueVisual =>
  QUEUE_VISUAL[bucketOf(status)];

/** format ISO string ke jam:menit lokal (id-ID) */
export const fmtTime = (iso: string | null): string =>
  iso
    ? new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso))
    : "-";

/**
 * Catatan customer disimpan BE sebagai satu string gabungan:
 *   "Cappuccino: less sugar | Latte: extra ice"
 * Dipecah balik jadi per-menu biar bisa nempel di baris item masing-masing.
 * Potongan yang gak ketemu menu-nya masuk ke `general` (jangan dibuang —
 * itu tetep instruksi customer).
 */
export interface ParsedNotes {
  byMenu: Record<string, string>;
  general: string[];
}

export const parseItemNotes = (notes: string | null): ParsedNotes => {
  const out: ParsedNotes = { byMenu: {}, general: [] };
  if (!notes) return out;

  for (const chunk of notes.split("|")) {
    const part = chunk.trim();
    if (!part) continue;

    const sep = part.indexOf(":");
    if (sep === -1) {
      out.general.push(part);
      continue;
    }
    const menu = part.slice(0, sep).trim();
    const note = part.slice(sep + 1).trim();
    if (menu && note) out.byMenu[menu] = note;
    else out.general.push(part);
  }
  return out;
};

/** ada catatan apa pun? dipakai buat nandain card "perlu diperhatiin" */
export const hasNotes = (notes: string | null): boolean => {
  const p = parseItemNotes(notes);
  return Object.keys(p.byMenu).length > 0 || p.general.length > 0;
};
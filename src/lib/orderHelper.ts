import { DateRange } from "@/components/orders/DateRangeSelector";

export function getRangeLabel(range: DateRange): string {
  switch (range) {
    case "today":
      return "Riwayat pesanan hari ini";
    case "7days":
      return "Riwayat pesanan 7 hari terakhir";
    case "30days":
      return "Riwayat pesanan 30 hari terakhir";
    case "90days":
      return "Riwayat pesanan 90 hari terakhir";
  }
}
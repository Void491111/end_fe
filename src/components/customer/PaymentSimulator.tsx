"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Loader2, QrCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { publicOrderApi } from "@/lib/api";

interface Props {
  orderId: number;
  total: number;
}

// Simulate Midtrans QRIS settlement.
// Di production akan digantikan Midtrans Snap.js + webhook — flow UI-nya sama.
// Cara jual di sidang: "Halaman ini di production akan menampilkan QRIS asli via Midtrans.
// Untuk demo lokal saya simulasikan via tombol karena Midtrans membutuhkan URL publik."
export function PaymentSimulator({ orderId, total }: Props) {
  const [isPaying, setIsPaying] = useState(false);

  const handleSimulate = async () => {
    setIsPaying(true);
    try {
      await publicOrderApi.simulatePayment(orderId);
      toast.success("Pembayaran berhasil!", {
        description: "Pesanan akan segera diproses",
      });
      // Polling di parent bakal auto-refresh status jadi 'paid' dalam 5 detik
    } catch (err) {
      const msg =
        (err as AxiosError<{ message?: string }>).response?.data?.message ||
        "Gagal proses pembayaran. Coba lagi.";
      toast.error(msg);
      setIsPaying(false); // Reset kalo error, biar bisa retry
    }
  };

  return (
    <section className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Bayar QRIS
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Total: <span className="font-bold text-foreground">{formatCurrency(Number(total))}</span>
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded">
          Simulasi
        </span>
      </div>

      {/* QR placeholder — di production Midtrans return image URL asli */}
      <div className="mx-auto w-40 aspect-square rounded-lg bg-white border-2 border-primary/20 flex items-center justify-center p-3">
        <QRPatternPlaceholder />
      </div>

      <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
        Scan QR di atas menggunakan aplikasi e-wallet atau mobile banking untuk membayar.
      </p>

      {/* Simulate button */}
      <Button
        onClick={handleSimulate}
        disabled={isPaying}
        size="lg"
        className="w-full font-bold"
      >
        {isPaying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Simulasi Pembayaran Berhasil
          </>
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground italic">
        Di production tombol ini akan diganti dengan Midtrans QRIS asli.
      </p>
    </section>
  );
}

// Dummy QR pattern — visual saja, gak bisa di-scan (dan emang gak butuh)
function QRPatternPlaceholder() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Corner squares (finder patterns) */}
      <rect x="5" y="5" width="20" height="20" fill="black" />
      <rect x="9" y="9" width="12" height="12" fill="white" />
      <rect x="12" y="12" width="6" height="6" fill="black" />

      <rect x="75" y="5" width="20" height="20" fill="black" />
      <rect x="79" y="9" width="12" height="12" fill="white" />
      <rect x="82" y="12" width="6" height="6" fill="black" />

      <rect x="5" y="75" width="20" height="20" fill="black" />
      <rect x="9" y="79" width="12" height="12" fill="white" />
      <rect x="12" y="82" width="6" height="6" fill="black" />

      {/* Random data dots buat "QR feel" */}
      {[
        [30, 10], [40, 10], [50, 15], [60, 10], [30, 20], [50, 25], [65, 20],
        [30, 30], [40, 35], [55, 30], [70, 35], [40, 45], [55, 50], [70, 45],
        [30, 55], [45, 55], [60, 60], [75, 55], [35, 65], [50, 70], [65, 65],
        [80, 70], [40, 80], [55, 85], [70, 80], [85, 85], [45, 90], [60, 90],
        [10, 35], [15, 45], [20, 55], [10, 65], [88, 35], [90, 45], [88, 55],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="5" height="5" fill="black" />
      ))}
    </svg>
  );
}

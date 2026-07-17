import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function TableNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-xl font-bold">Meja tidak ditemukan</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Kode meja tidak valid atau meja sedang tidak aktif. Silakan hubungi kasir untuk bantuan.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm text-primary underline underline-offset-4"
      >
        Kembali ke beranda
      </Link>
    </div>
  );
}
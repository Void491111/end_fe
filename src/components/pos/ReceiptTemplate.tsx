"use client";

import { formatCurrency } from "@/lib/format";
import { APP_NAME } from "@/lib/constants";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface Props {
  queueNumber: string;
  total: number;
  cashReceived: number;
  changeAmount: number;
  items?: ReceiptItem[];
  orderType?: string;
}

export function ReceiptTemplate({
  queueNumber,
  total,
  cashReceived,
  changeAmount,
  items = [],
  orderType,
}: Props) {
  const now = new Date();

  return (
    <div className="print-receipt hidden print:block font-mono text-black">
      <div className="text-center">
        <h1 className="text-base font-bold uppercase">{APP_NAME}</h1>
        <p className="text-[10px]">Terima kasih atas kunjungan Anda</p>
      </div>

      <div className="border-t border-dashed border-black my-2" />

      <div className="text-[11px] space-y-0.5">
        <div className="flex justify-between">
          <span>No. Antrian</span>
          <span className="font-bold">{queueNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Tanggal</span>
          <span>{now.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}</span>
        </div>
        {orderType && (
          <div className="flex justify-between">
            <span>Tipe</span>
            <span className="uppercase">{orderType}</span>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <>
          <div className="border-t border-dashed border-black my-2" />
          <div className="text-[11px] space-y-1">
            {items.map((it, i) => (
              <div key={i}>
                <div>{it.name}</div>
                <div className="flex justify-between">
                  <span>{it.quantity} x {formatCurrency(it.price)}</span>
                  <span>{formatCurrency(it.quantity * it.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="border-t border-dashed border-black my-2" />

      <div className="text-[11px] space-y-0.5">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Cash</span>
          <span>{formatCurrency(cashReceived)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kembalian</span>
          <span>{formatCurrency(changeAmount)}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-black my-2" />

      <div className="text-center text-[10px]">
        <p>Simpan struk ini sebagai bukti</p>
        <p className="mt-1 font-bold">== TERIMA KASIH ==</p>
      </div>
    </div>
  );
}
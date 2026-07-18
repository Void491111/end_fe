"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import { publicOrderApi } from "@/lib/api";
import { useCustomerCartStore } from "@/store/useCustomerCartStore";
import { CustomerCartItem } from "./CustomerCartItem";
import { CustomerCartSummary } from "./CustomerCartSummary";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableCode: string;
}

export function CustomerCartDrawer({ open, onOpenChange, tableCode }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCustomerCartStore((s) => s.items);
  const customerName = useCustomerCartStore((s) => s.customerName);
  const setCustomerName = useCustomerCartStore((s) => s.setCustomerName);
  const clearCart = useCustomerCartStore((s) => s.clearCart);
  const subtotal = useCustomerCartStore((s) => s.getSubtotal());
  const tax = useCustomerCartStore((s) => s.getTax());
  const total = useCustomerCartStore((s) => s.getTotal());

  const canSubmit = customerName.trim().length >= 2 && items.length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const res = await publicOrderApi.create({
        table_code: tableCode,
        customer_name: customerName.trim(),
        items: items.map((i) => ({
          menu_id: Number(i.id),
          quantity: i.quantity,
          notes: i.notes || undefined,
        })),
      });

      toast.success("Pesanan berhasil dibuat!", {
        description: `No. Antrian: ${res.data.queue_number}`,
      });

      clearCart();
      onOpenChange(false);
      router.push(`/order/${tableCode}/status/${res.data.id}`);
    } catch (err) {
      const msg =
        (err as AxiosError<{ message?: string }>).response?.data?.message ||
        "Gagal kirim pesanan. Cek koneksi.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex flex-col rounded-t-2xl p-0 max-h-[92vh]">
        <SheetHeader className="px-4 pt-5 pb-3 border-b border-border">
          <SheetTitle className="text-lg font-bold text-left">Pesanan Kamu</SheetTitle>
          <SheetDescription className="text-xs text-left">
            {items.length} item · Meja {tableCode}
          </SheetDescription>
        </SheetHeader>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Belum ada item di cart
            </div>
          ) : (
            items.map((item) => <CustomerCartItem key={item.cartItemId} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-background px-4 pt-3 pb-4 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="customer-name" className="text-xs">
                Nama Kamu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Alif"
                className="h-9"
                maxLength={100}
              />
            </div>

            <CustomerCartSummary subtotal={subtotal} tax={tax} total={total} />

            <Button onClick={handleSubmit} disabled={!canSubmit} size="lg" className="w-full font-bold">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                `Kirim Pesanan · ${formatCurrency(total)}`
              )}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground">
              Bayar tunai ke kasir setelah pesanan dibuat
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

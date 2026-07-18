"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Minus, Plus, Trash2, Loader2, StickyNote } from "lucide-react";
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
import { useCustomerCartStore } from "@/store/useCustomerCartStore";
import { publicOrderApi } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableCode: string;
}

export function CustomerCartDrawer({ open, onOpenChange, tableCode }: Props) {
  const router = useRouter();
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCustomerCartStore((s) => s.items);
  const customerName = useCustomerCartStore((s) => s.customerName);
  const setCustomerName = useCustomerCartStore((s) => s.setCustomerName);
  const updateQuantity = useCustomerCartStore((s) => s.updateQuantity);
  const updateNotes = useCustomerCartStore((s) => s.updateNotes);
  const removeItem = useCustomerCartStore((s) => s.removeItem);
  const clearCart = useCustomerCartStore((s) => s.clearCart);
  const subtotal = useCustomerCartStore((s) => s.getSubtotal());
  const tax = useCustomerCartStore((s) => s.getTax());
  const total = useCustomerCartStore((s) => s.getTotal());

  const handleSubmit = async () => {
    if (customerName.trim().length < 2) {
      toast.error("Nama minimal 2 karakter");
      return;
    }
    if (items.length === 0) {
      toast.error("Cart kosong");
      return;
    }

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

      const order = res.data;

      toast.success("Pesanan berhasil dibuat! 🎉", {
        description: `No. Antrian: ${order.queue_number}`,
      });

      clearCart();
      onOpenChange(false);

      // Redirect ke status page (Batch 5C bikin page-nya; kalau belum ada, ini akan 404 tapi order tetep tersimpan)
      router.push(`/order/${tableCode}/status/${order.id}`);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg =
        axiosErr.response?.data?.message ||
        "Gagal kirim pesanan. Cek koneksi.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex flex-col rounded-t-2xl p-0 max-h-[92vh]"
      >
        {/* Header */}
        <SheetHeader className="px-4 pt-5 pb-3 border-b border-border">
          <SheetTitle className="text-lg font-bold text-left">
            Pesanan Kamu
          </SheetTitle>
          <SheetDescription className="text-xs text-left">
            {items.length} item · Meja {tableCode}
          </SheetDescription>
        </SheetHeader>

        {/* Items list — scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Belum ada item di cart
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="rounded-md border border-border p-3 bg-card"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="h-14 w-14 shrink-0 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl opacity-60">☕</span>
                    )}
                  </div>

                  {/* Info + controls */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-muted-foreground hover:text-destructive p-1 -m-1 shrink-0"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Qty + subtotal */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background active:scale-95 transition-transform"
                          aria-label="Kurangi"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-bold min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground active:scale-95 transition-transform"
                          aria-label="Tambah"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Notes toggle */}
                    <button
                      onClick={() =>
                        setExpandedNotes(
                          expandedNotes === item.cartItemId
                            ? null
                            : item.cartItemId
                        )
                      }
                      className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      <StickyNote className="h-3 w-3" />
                      {item.notes
                        ? "Edit catatan"
                        : "Tambah catatan (opsional)"}
                    </button>

                    {expandedNotes === item.cartItemId && (
                      <Input
                        value={item.notes || ""}
                        onChange={(e) =>
                          updateNotes(item.cartItemId, e.target.value)
                        }
                        placeholder="Contoh: less sugar, no ice..."
                        className="mt-2 h-8 text-xs"
                        maxLength={200}
                        autoFocus
                      />
                    )}
                    {item.notes && expandedNotes !== item.cartItemId && (
                      <p className="mt-1 text-[11px] text-muted-foreground italic line-clamp-1">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — sticky */}
        {items.length > 0 && (
          <div className="border-t border-border bg-background px-4 pt-3 pb-4 space-y-3">
            {/* Customer name */}
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

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pajak (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || customerName.trim().length < 2}
              size="lg"
              className="w-full font-bold"
            >
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

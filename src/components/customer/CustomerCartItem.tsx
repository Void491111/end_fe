"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import type { CustomerCartItem as Item } from "@/store/useCustomerCartStore";
import { useCustomerCartStore } from "@/store/useCustomerCartStore";

interface Props {
  item: Item;
}

export function CustomerCartItem({ item }: Props) {
  const [notesOpen, setNotesOpen] = useState(false);
  const updateQuantity = useCustomerCartStore((s) => s.updateQuantity);
  const updateNotes = useCustomerCartStore((s) => s.updateNotes);
  const removeItem = useCustomerCartStore((s) => s.removeItem);

  return (
    <div className="rounded-md border border-border p-3 bg-card">
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="h-14 w-14 shrink-0 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl opacity-60">☕</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + delete */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold leading-tight line-clamp-1">{item.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(item.price)}</p>
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
                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background active:scale-95 transition-transform"
                aria-label="Kurangi"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-sm font-bold min-w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground active:scale-95 transition-transform"
                aria-label="Tambah"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
          </div>

          {/* Notes toggle */}
          <button
            onClick={() => setNotesOpen((v) => !v)}
            className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <StickyNote className="h-3 w-3" />
            {item.notes ? "Edit catatan" : "Tambah catatan (opsional)"}
          </button>

          {notesOpen && (
            <Input
              value={item.notes || ""}
              onChange={(e) => updateNotes(item.cartItemId, e.target.value)}
              placeholder="Contoh: less sugar, no ice..."
              className="mt-2 h-8 text-xs"
              maxLength={200}
              autoFocus
            />
          )}
          {item.notes && !notesOpen && (
            <p className="mt-1 text-[11px] text-muted-foreground italic line-clamp-1">
              {item.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

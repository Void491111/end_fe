"use client";

import { useState } from "react";
import { MenuItem } from "@/types/menu";
import { IceLevel, SugarLevel } from "@/types/order";
import { useCartStore } from "@/store/useCartStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMenuStore } from "@/store/useMenuStore";

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ICE_OPTIONS: IceLevel[] = ["Normal", "Less Ice", "No Ice"];
const SUGAR_OPTIONS: SugarLevel[] = ["Normal", "Less Sugar", "No Sugar"];

export function CustomizationModal({ item, isOpen, onClose }: CustomizationModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  
  const [ice, setIce] = useState<IceLevel>("Normal");
  const [sugar, setSugar] = useState<SugarLevel>("Normal");
  const [notes, setNotes] = useState("");
  
  // PERBAIKAN 1: Cara narik data item yang benar
  const liveItem = useMenuStore((s) => s.items.find((i) => i.id === item?.id));
  const isAvailable = liveItem?.isAvailable ?? false;

  if (!item) return null;

  const handleAdd = () => {
    // PERBAIKAN 2: Pertahanan ganda, tolak kalau item habis
    if (!item || !isAvailable) return;

    addItem(item, ice, sugar, notes);
    setIce("Normal");
    setSugar("Normal"); // PERBAIKAN 3: Titik koma, bukan koma
    setNotes("");
    onClose();
  };

  const isCoffeeOrTea = item.categoryId === "coffee" || item.categoryId === "non-coffee";

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kustomisasi: {item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tampilkan opsi Es & Gula HANYA untuk minuman */}
          {isCoffeeOrTea && (
            <>
              <div className="space-y-3">
                <Label>Ice Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  {ICE_OPTIONS.map((opt) => (
                    <Button
                      key={opt}
                      type="button"
                      variant={ice === opt ? "default" : "outline"}
                      className="w-full text-xs"
                      onClick={() => setIce(opt)}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Sugar Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  {SUGAR_OPTIONS.map((opt) => (
                    <Button
                      key={opt}
                      type="button"
                      variant={sugar === opt ? "default" : "outline"}
                      className="w-full text-xs"
                      onClick={() => setSugar(opt)}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-3">
            <Label>Catatan Tambahan (Opsional)</Label>
            <Input 
              placeholder="Contoh: Pisah es, tambah extra shot..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          {/* PERBAIKAN 4: Gembok tombol dan ubah teksnya kalau stok habis */}
          <Button disabled={!isAvailable} onClick={handleAdd}>
            {isAvailable ? "Tambah ke Keranjang" : "Stok Habis"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
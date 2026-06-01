"use client";

import { Package, Search } from "lucide-react";
import { useState } from "react";
import { useMenuStore } from "@/store/useMenuStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const { items, toggleAvailability } = useMenuStore();
  const [search, setSearch] = useState("");

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Header Halaman */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Stok & Menu
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Atur ketersediaan menu yang tampil di POS
            </p>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Pencarian */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 max-w-md bg-card"
            />
          </div>

          {/* List Menu */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-border bg-secondary/30 font-medium text-sm text-muted-foreground">
              <div className="w-12 text-center">Status</div>
              <div>Detail Menu</div>
              <div className="w-32 text-right">Aksi</div>
            </div>
            
            <div className="divide-y divide-border">
              {filteredItems.map((item) => (
                <div key={item.id} className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center hover:bg-secondary/10 transition-colors">
                  
                  {/* Status Indicator */}
                  <div className="w-12 flex justify-center">
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      item.isAvailable ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    )} />
                  </div>

                  {/* Info Menu */}
                  <div>
                    <p className={cn("font-semibold", !item.isAvailable && "text-muted-foreground")}>
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.categoryId.toUpperCase()} • {formatCurrency(item.price)}
                    </p>
                  </div>

                  {/* Tombol Toggle */}
                  <div className="w-32 text-right">
                    <Button
                      variant={item.isAvailable ? "outline" : "default"}
                      size="sm"
                      className={cn(
                        "w-full font-semibold",
                        !item.isAvailable && "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      )}
                      onClick={() => toggleAvailability(item.id)}
                    >
                      {item.isAvailable ? "Habiskan" : "Tersedia"}
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
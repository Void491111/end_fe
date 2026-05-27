"use client";

import { useState } from "react";
import { useMenu } from "@/hooks/useMenu";
import { MenuCard } from "./MenuCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag } from "lucide-react";
import { CustomizationModal } from "./CustomizationModal";
import { MenuItem } from "@/types/menu";

export function MenuGrid() {
  const { items } = useMenu();
  // State untuk melacak item mana yang sedang diklik untuk dikustomisasi
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No items found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Try a different category or search term
        </p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <MenuCard 
              key={item.id} 
              item={item} 
              // Saat diklik, simpan item ke state
              onSelect={(clickedItem) => setSelectedItem(clickedItem)} 
            />
          ))}
        </div>
      </ScrollArea>

      {/* Render modal kustomisasi di luar loop grid supaya performanya ringan */}
      <CustomizationModal 
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { Loader2, Coffee } from "lucide-react";
import { useCustomerData } from "@/hooks/useCustomerData";
import { CustomerCategoryTabs } from "@/components/customer/CustomerCategoryTabs";
import { CustomerMenuCard } from "@/components/customer/CustomerMenuCard";
import { CustomerCartBar } from "@/components/customer/CustomerCartBar";
import { CustomerCartDrawer } from "@/components/customer/CustomerCartDrawer";
import { CustomerRecommendations } from "@/components/customer/CustomerRecommendations";
import { useCustomerCartStore } from "@/store/useCustomerCartStore";

export default function CustomerOrderPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const { table, menus, categories, isLoading, tableInvalid } = useCustomerData(code);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const setTableCode = useCustomerCartStore((s) => s.setTableCode);

  useEffect(() => {
    if (code) setTableCode(code);
  }, [code, setTableCode]);

  if (tableInvalid) notFound();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredMenus = activeCategory === "all"
    ? menus
    : menus.filter((m) => m.categoryId === activeCategory);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Coffee className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground leading-tight">Mooiste Cafe</p>
            <h1 className="text-base font-bold leading-tight truncate">
              {table?.name} · <span className="text-primary">{table?.code}</span>
            </h1>
          </div>
        </div>
      </header>

      <section className="px-4 pt-4 pb-2">
        <div className="rounded-lg bg-linear-to-br from-primary/10 to-primary/5 p-4 border border-primary/20">
          <h2 className="text-base font-bold">Selamat datang! 👋</h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Silakan pilih menu favorit kamu. Pesanan akan dikirim langsung ke kasir.
          </p>
        </div>
      </section>

      {/* Rekomendasi best-seller — hide otomatis kalo kosong */}
      <CustomerRecommendations />

      <CustomerCategoryTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <section className="px-4 py-3 pb-28">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Tidak ada menu di kategori ini
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredMenus.map((item) => (
              <CustomerMenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <CustomerCartBar onOpen={() => setCartOpen(true)} />
      <CustomerCartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        tableCode={code}
      />
    </>
  );
}

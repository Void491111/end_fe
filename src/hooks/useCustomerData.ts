"use client";

import { useEffect, useState } from "react";
import { publicTableApi, publicMenuApi } from "@/lib/api";
import { CafeTable } from "@/types/table";
import { MenuItem, Category } from "@/types/menu";

// Map API menu → FE MenuItem shape (sama pattern kayak useMenuStore kasir)
const mapMenu = (raw: any): MenuItem => ({
  id: String(raw.id),
  name: raw.name,
  description: raw.description ?? "",
  price: parseFloat(raw.price),
  image: raw.image ?? null,
  imageUrl: raw.imageUrl ?? "",
  categoryId: raw.category?.slug ?? String(raw.category_id),
  isAvailable: !!raw.is_available,
});

const mapCategory = (raw: any): Category => ({
  id: raw.slug ?? String(raw.id),
  name: raw.name,
  icon: raw.icon ?? "",
  slug: raw.slug,
});

interface CustomerDataState {
  table: CafeTable | null;
  menus: MenuItem[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  tableInvalid: boolean;
}

export function useCustomerData(code: string) {
  const [state, setState] = useState<CustomerDataState>({
    table: null,
    menus: [],
    categories: [],
    isLoading: true,
    error: null,
    tableInvalid: false,
  });

  useEffect(() => {
    let alive = true;

    const fetchAll = async () => {
      try {
        // Validate table dulu — kalau gagal, langsung stop
        const tableRes = await publicTableApi.validate(code);
        if (!alive) return;

        // Table valid → fetch menu + categories parallel
        const [menuRes, catRes] = await Promise.all([
          publicMenuApi.list(),
          publicMenuApi.categories(),
        ]);

        if (!alive) return;

        setState({
          table: tableRes.data,
          menus: menuRes.data.map(mapMenu),
          categories: catRes.data.map(mapCategory),
          isLoading: false,
          error: null,
          tableInvalid: false,
        });
      } catch (err: any) {
        if (!alive) return;

        const status = err?.response?.status;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          tableInvalid: status === 404 || status === 403,
          error: err?.response?.data?.message || "Gagal load data",
        }));
      }
    };

    fetchAll();
    return () => { alive = false; };
  }, [code]);

  return state;
}
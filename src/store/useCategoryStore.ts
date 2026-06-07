import { create } from "zustand";
import { Category } from "@/types/menu";
import { categoryApi } from "@/lib/api";

interface CategoryState {
  items: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

// Map DB icon string → Lucide icon name (PascalCase)
const iconMap: Record<string, string> = {
  coffee: "Coffee",
  cup: "CupSoda",
  food: "UtensilsCrossed",
  cookie: "Cookie",
  "ice-cream": "IceCream",
};

const mapCategory = (raw: any): Category => ({
  id: raw.slug, // pake slug as ID buat match sama menu.categoryId
  name: raw.name,
  icon: iconMap[raw.icon] ?? "Coffee", // fallback icon
  slug: raw.slug,
  isActive: true,
});

export const useCategoryStore = create<CategoryState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await categoryApi.list();
      set({ items: data.map(mapCategory), isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Gagal load kategori",
        isLoading: false,
      });
    }
  },
}));
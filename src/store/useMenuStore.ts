import { create } from "zustand";
import { MenuItem } from "@/types/menu";
import { menuApi } from "@/lib/api";

interface MenuState {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
  fetchMenus: () => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}

// Map API response shape → FE MenuItem shape
const mapMenu = (raw: any): MenuItem => ({
  id: String(raw.id),
  name: raw.name,
  description: raw.description ?? "",
  price: parseFloat(raw.price),
  categoryId: String(raw.category_id),
  imageUrl: raw.image ?? "",
  isAvailable: !!raw.is_available,
});

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchMenus: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await menuApi.list();
      set({ items: data.map(mapMenu), isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Gagal load menu",
        isLoading: false,
      });
    }
  },

  toggleAvailability: async (id: string) => {
    // Optimistic update — UI langsung berubah, kalo gagal di-rollback
    const prevItems = get().items;
    set({
      items: prevItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      ),
    });

    try {
      await menuApi.toggleAvailability(parseInt(id));
    } catch (err) {
      // Rollback kalo API call gagal
      set({ items: prevItems });
      throw err;
    }
  },
}));
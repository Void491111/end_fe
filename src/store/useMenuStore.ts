import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem } from "@/types/menu";
import { menuItems as defaultMenu } from "@/data/menuItems"; // Ambil data statis sebagai nilai awal

interface MenuState {
  items: MenuItem[];
  toggleAvailability: (id: string) => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      items: defaultMenu,
      
      // Fungsi untuk mengubah status Tersedia <-> Habis
      toggleAvailability: (id: string) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
          ),
        })),
    }),
    { name: "mooiste-inventory" }
  )
);
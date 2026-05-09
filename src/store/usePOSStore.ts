import { create } from "zustand";

interface POSState {
  activeCategory: string;
  searchQuery: string;
  setActiveCategory: (id: string) => void;
  setSearchQuery: (query: string) => void;
}

export const usePOSStore = create<POSState>((set) => ({
  activeCategory: "all",
  searchQuery: "",
  setActiveCategory: (id) => set({ activeCategory: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
// src/store/useSplashStore.ts
import { create } from "zustand";

interface SplashState {
  /** true = mainkan splash kasir (di-set pas login sukses) */
  showCashierSplash: boolean;
  triggerCashierSplash: () => void;
  clearCashierSplash: () => void;
}

/**
 * SENGAJA tidak di-persist.
 * Flag ini cuma hidup di memori, jadi splash cuma main tepat setelah login,
 * bukan tiap kali /pos di-refresh.
 */
export const useSplashStore = create<SplashState>((set) => ({
  showCashierSplash: false,
  triggerCashierSplash: () => set({ showCashierSplash: true }),
  clearCashierSplash: () => set({ showCashierSplash: false }),
}));
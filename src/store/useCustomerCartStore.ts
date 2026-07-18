import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem } from "@/types/menu";
import { TAX_RATE } from "@/lib/constants";

// Isolated dari useCartStore kasir:
// - Key persist beda ("mooiste-customer-cart") biar cart HP customer & POS kasir gak nyampur
// - Tanpa ice/sugar level (customer gak butuh customization ribet buat MVP)
// - Notes optional per item
// - customerName + tableCode tersimpan biar drawer form-nya inget kalau user close-buka

export interface CustomerCartItem extends MenuItem {
  cartItemId: string;
  quantity: number;
  notes?: string;
}

interface CustomerCartState {
  items: CustomerCartItem[];
  customerName: string;
  tableCode: string | null;

  addItem: (item: MenuItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateNotes: (cartItemId: string, notes: string) => void;
  setCustomerName: (name: string) => void;
  setTableCode: (code: string) => void;
  clearCart: () => void;

  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  getQuantityFor: (menuId: string) => number;
}

export const useCustomerCartStore = create<CustomerCartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerName: "",
      tableCode: null,

      addItem: (item: MenuItem) =>
        set((state) => {
          const cartItemId = `${item.id}`;
          const existing = state.items.find((i) => i.cartItemId === cartItemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === cartItemId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          const newItem: CustomerCartItem = {
            ...item,
            cartItemId,
            quantity: 1,
            notes: "",
          };
          return { items: [...state.items, newItem] };
        }),

      removeItem: (cartItemId: string) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId: string, quantity: number) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.cartItemId !== cartItemId)
              : state.items.map((i) =>
                  i.cartItemId === cartItemId ? { ...i, quantity } : i
                ),
        })),

      updateNotes: (cartItemId: string, notes: string) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, notes } : i
          ),
        })),

      setCustomerName: (name: string) => set({ customerName: name }),

      setTableCode: (code: string) =>
        set((state) => {
          // Kalau ganti meja (scan QR meja lain), reset cart
          if (state.tableCode && state.tableCode !== code) {
            return { tableCode: code, items: [], customerName: "" };
          }
          return { tableCode: code };
        }),

      clearCart: () => set({ items: [], customerName: "" }),

      getSubtotal: () =>
        get().items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        ),

      getTax: () => get().getSubtotal() * TAX_RATE,

      getTotal: () => get().getSubtotal() + get().getTax(),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + Number(i.quantity), 0),

      getQuantityFor: (menuId: string) => {
        const item = get().items.find((i) => i.cartItemId === menuId);
        return item ? item.quantity : 0;
      },
    }),
    { name: "mooiste-customer-cart" }
  )
);

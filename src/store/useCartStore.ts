import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, OrderType } from "@/types/order";
import { MenuItem } from "@/types/menu";
import { TAX_RATE } from "@/lib/constants";

interface CartState {
  items: CartItem[];
  orderType: OrderType;

  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  setOrderType: (type: OrderType) => void;
  clearCart: () => void;

  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: "dine-in",

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id ? { ...i, quantity } : i
                ),
        })),

      updateNotes: (id, notes) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, notes } : i
          ),
        })),

      setOrderType: (type) => set({ orderType: type }),

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getTax: () => get().getSubtotal() * TAX_RATE,

      getTotal: () => get().getSubtotal() + get().getTax(),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "mooiste-cart" }
  )
);
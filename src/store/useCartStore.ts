import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, OrderType, IceLevel, SugarLevel } from "@/types/order";
import { MenuItem } from "@/types/menu";
import { TAX_RATE } from "@/lib/constants";

interface CartState {
  items: CartItem[];
  orderType: OrderType;

  addItem: (
    item: MenuItem,
    iceLevel?: IceLevel,
    sugarLevel?: SugarLevel,
    notes?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateNotes: (cartItemId: string, notes: string) => void;
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

      addItem: (
        item: MenuItem,
        iceLevel: IceLevel = "Normal",
        sugarLevel: SugarLevel = "Normal",
        notes: string = ""
      ) => 
        set((state) => {
          // Buat ID unik gabungan dari id menu + kustomisasi supaya item dengan notes beda tidak ter-merge
          const cartItemId = `${item.id}-${iceLevel}-${sugarLevel}-${notes}`;

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
          
          const newItem: CartItem = {
            ...item,
            cartItemId,
            quantity: 1,
            iceLevel,
            sugarLevel,
            notes,
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

      setOrderType: (type: OrderType) => set({ orderType: type }),

      clearCart: () => set({ items: [] }),

      getSubtotal: (): number => {
        const items = get().items;
        return items.reduce(
          (sum: number, item: CartItem) =>
            sum + Number(item.price) * Number(item.quantity),
          0
        );
      },

      getTax: (): number => get().getSubtotal() * TAX_RATE,

      getTotal: (): number => get().getSubtotal() + get().getTax(),

      getItemCount: (): number => {
        const items = get().items;
        return items.reduce(
          (sum: number, item: CartItem) => sum + Number(item.quantity),
          0
        );
      },
    }),
    { name: "mooiste-cart" }
  )
);
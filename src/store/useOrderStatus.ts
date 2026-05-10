import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CompletedOrder } from "@/types/order";

interface OrderState {
  orders: CompletedOrder[];
  lastQueueNumber: number;

  addOrder: (order: CompletedOrder) => void;
  voidOrder: (id: string) => void;
  getNextQueueNumber: () => string;
  getTodayOrders: () => CompletedOrder[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastQueueNumber: 0,

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      voidOrder: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: "voided" } : o
          ),
        })),

      getNextQueueNumber: () => {
        const next = get().lastQueueNumber + 1;
        set({ lastQueueNumber: next });
        const padded = String(next).padStart(3, "0");
        return `A${padded}`;
      },

      getTodayOrders: () => {
        const today = new Date().toDateString();
        return get().orders.filter(
          (o) => new Date(o.createdAt).toDateString() === today
        );
      },
    }),
    { name: "mooiste-orders" }
  )
);
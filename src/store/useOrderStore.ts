import { create } from "zustand";
import { AxiosError } from "axios";
import { CompletedOrder } from "@/types/order";
import { orderApi } from "@/lib/api";

interface OrderStats {
  total_orders: number;
  total_revenue: number;
  avg_order: number;
  voided_count: number;
  voided_amount: number;
}

interface OrderState {
  orders: CompletedOrder[];
  stats: OrderStats | null;
  isLoading: boolean;
  error: string | null;

  fetchOrders: (params?: {
    period?: string;
    status?: string;
    search?: string;
  }) => Promise<void>;
  fetchStats: (period?: string) => Promise<void>;
  voidOrder: (id: string, reason: string) => Promise<void>;
}

// Map API response → CompletedOrder shape (yang FE expect)
const mapOrder = (raw: any): CompletedOrder => ({
  id: String(raw.id),
  queueNumber: raw.queue_number,
  items: (raw.items ?? []).map((item: any) => ({
    cartItemId: String(item.id),
    id: String(item.menu_id),
    name: item.menu_name_snapshot,
    description: "",
    price: parseFloat(item.price_snapshot),
    quantity: item.quantity,
    categoryId: "",
    imageUrl: "",
    iceLevel: "Normal" as any,
    sugarLevel: "Normal" as any,
    notes: "",
  })),
  subtotal: parseFloat(raw.subtotal),
  tax: parseFloat(raw.tax),
  total: parseFloat(raw.total),
  cashReceived: parseFloat(raw.total), // BE ga simpen cash, default ke total
  changeAmount: 0, // BE ga simpen change
  paymentMethod: "cash",
  orderType: raw.order_type === "dine_in" ? "dine-in" : "Takeaway",
  status: raw.status,
  kasirName: raw.user?.name ?? "Unknown",
  createdAt: raw.created_at,
});

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchOrders: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await orderApi.list(params);
      // Laravel paginated: { data: [...], current_page, ... }
      const orderArray = data.data ?? data;
      set({ orders: orderArray.map(mapOrder), isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Gagal load orders",
        isLoading: false,
      });
    }
  },

  fetchStats: async (period = "today") => {
    try {
      const { data } = await orderApi.stats(period);
      set({ stats: data });
    } catch {
      // silent fail untuk stats, ga critical
    }
  },

  voidOrder: async (id: string, reason: string) => {
    try {
      const { data } = await orderApi.void(parseInt(id), reason);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? mapOrder(data) : o)),
      }));
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.message || "Gagal void order");
      }
      throw err;
    }
  },
}));
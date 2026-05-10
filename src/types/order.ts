import { MenuItem } from "./menu";

export interface CartItem extends MenuItem {
    quantity: number;
    notes?: string;
}

export type OrderType = "dine-in" | "Takeaway";
export type OrderStatus = "pending" | "Completed" | "voided";
export type PaymentMethod = "cash";

export interface CompletedOrder {
    id: string;
    queueNumber: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    cashReceived: number;
    changeAmount: number;
    paymentMethod: PaymentMethod;
    orderType: OrderType;
    status: OrderStatus;
    kasirName: string;
    createdAt: string;
}
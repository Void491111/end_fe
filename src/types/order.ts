import { MenuItem } from "./menu";


export type IceLevel = "Normal" | "Less Ice" | "No Ice";
export type SugarLevel = "Normal" | "Less Sugar" | "No Sugar";

export interface CartItem extends MenuItem {
    cartItemId: string; 
    quantity: number;
    notes?: string;
    iceLevel?: IceLevel;
    sugarLevel?: SugarLevel;
}

export type OrderType = "dine-in" | "Takeaway";
export type OrderStatus = "pending" | "completed" | "voided";
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
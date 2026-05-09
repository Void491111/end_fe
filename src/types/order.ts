import { MenuItem } from "./menu";

export interface CartItem extends MenuItem {
    quantity: number;
    notes: string;
}

export type OrderType = "dine-in" | "takeaway";

export interface Order {
    id: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    orderType: OrderType;
    createdAt: string;
}


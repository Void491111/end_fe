import { MenuItem } from "./menu";

export interface CartItem extends MenuItem {
    quantity: number;
    notes?: string;
}

export type OrderType = "dine-in" | "takeaway";
export interface Category {
    id: string;
    name: string;
    icon: string;
    slug?: string;
    isActive?: boolean;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
    isAvailable: boolean;
}
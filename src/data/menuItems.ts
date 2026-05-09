import { MenuItem } from "@/types/menu";

export const menuItems: MenuItem[] = [
  // Coffee
  { id: "1", name: "Espresso", description: "Rich and bold", price: 22000, categoryId: "coffee", imageUrl: "/images/menu/espresso.jpg", isAvailable: true },
  { id: "2", name: "Cappuccino", description: "Espresso with steamed milk foam", price: 28000, categoryId: "coffee", imageUrl: "/images/menu/cappuccino.jpg", isAvailable: true },
  { id: "3", name: "Latte", description: "Smooth espresso with milk", price: 30000, categoryId: "coffee", imageUrl: "/images/menu/latte.jpg", isAvailable: true },
  { id: "4", name: "Americano", description: "Espresso with hot water", price: 25000, categoryId: "coffee", imageUrl: "/images/menu/americano.jpg", isAvailable: true },
  { id: "5", name: "Mocha", description: "Espresso, chocolate, milk", price: 32000, categoryId: "coffee", imageUrl: "/images/menu/mocha.jpg", isAvailable: true },
  { id: "6", name: "Macchiato", description: "Espresso with milk foam", price: 28000, categoryId: "coffee", imageUrl: "/images/menu/macchiato.jpg", isAvailable: true },
  
  // Non-Coffee
  { id: "7", name: "Matcha Latte", description: "Premium Japanese matcha", price: 35000, categoryId: "non-coffee", imageUrl: "/images/menu/matcha.jpg", isAvailable: true },
  { id: "8", name: "Hot Chocolate", description: "Rich Belgian chocolate", price: 30000, categoryId: "non-coffee", imageUrl: "/images/menu/chocolate.jpg", isAvailable: true },
  { id: "9", name: "Lemonade", description: "Fresh squeezed lemon", price: 25000, categoryId: "non-coffee", imageUrl: "/images/menu/lemonade.jpg", isAvailable: true },
  { id: "10", name: "Iced Tea", description: "Refreshing black tea", price: 18000, categoryId: "non-coffee", imageUrl: "/images/menu/icedtea.jpg", isAvailable: true },
  
  // Food
  { id: "11", name: "Club Sandwich", description: "Triple stacked classic", price: 45000, categoryId: "food", imageUrl: "/images/menu/sandwich.jpg", isAvailable: true },
  { id: "12", name: "Carbonara", description: "Creamy pasta with bacon", price: 55000, categoryId: "food", imageUrl: "/images/menu/carbonara.jpg", isAvailable: true },
  { id: "13", name: "Caesar Salad", description: "Fresh romaine & parmesan", price: 40000, categoryId: "food", imageUrl: "/images/menu/salad.jpg", isAvailable: true },
  { id: "14", name: "Beef Burger", description: "Juicy beef patty", price: 50000, categoryId: "food", imageUrl: "/images/menu/burger.jpg", isAvailable: true },
  
  // Snack
  { id: "15", name: "French Fries", description: "Crispy golden fries", price: 22000, categoryId: "snack", imageUrl: "/images/menu/fries.jpg", isAvailable: true },
  { id: "16", name: "Chicken Wings", description: "6 pieces of glory", price: 38000, categoryId: "snack", imageUrl: "/images/menu/wings.jpg", isAvailable: true },
  { id: "17", name: "Onion Rings", description: "Crispy battered rings", price: 25000, categoryId: "snack", imageUrl: "/images/menu/onionrings.jpg", isAvailable: true },
  
  // Dessert
  { id: "18", name: "Tiramisu", description: "Classic Italian dessert", price: 35000, categoryId: "dessert", imageUrl: "/images/menu/tiramisu.jpg", isAvailable: true },
  { id: "19", name: "Cheesecake", description: "New York style", price: 32000, categoryId: "dessert", imageUrl: "/images/menu/cheesecake.jpg", isAvailable: true },
  { id: "20", name: "Brownie", description: "Warm chocolate brownie", price: 28000, categoryId: "dessert", imageUrl: "/images/menu/brownie.jpg", isAvailable: true },
];
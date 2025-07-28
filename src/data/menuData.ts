import { MenuItem, MenuCategory, Restaurant } from "@/types";

// Restaurant information
export const restaurantInfo: Restaurant = {
  id: "restaurant-1",
  name: "Delicious AR Bistro",
  description: "Experience fine dining in augmented reality",
  logo: "/images/logo.png",
  address: "123 Food Street, Gourmet City",
  phone: "+1 (555) 123-4567",
  website: "https://arbistro.com",
  ownerId: "owner-1",
  isActive: true,
  subscriptionPlan: "premium",
  qrCodeSecret: "bistro-secret-123",
  customDomain: "bistro",
  theme: {
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    backgroundColor: "#f8f9fa",
    fontFamily: "Roboto",
    logo: "/images/logo.png",
  },
  createdAt: new Date(),
};

// Menu categories
export const menuCategories: MenuCategory[] = [
  {
    id: "starters",
    name: "Starters",
    description: "Light bites to begin your journey",
    icon: "🥗",
    restaurantId: "restaurant-1",
    sortOrder: 1,
  },
  {
    id: "mains",
    name: "Main Course",
    description: "Hearty and satisfying dishes",
    icon: "🍖",
    restaurantId: "restaurant-1",
    sortOrder: 2,
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet endings to your meal",
    icon: "🍰",
    restaurantId: "restaurant-1",
    sortOrder: 3,
  },
  {
    id: "drinks",
    name: "Beverages",
    description: "Refreshing drinks and cocktails",
    icon: "🍷",
    restaurantId: "restaurant-1",
    sortOrder: 4,
  },
];

// Sample menu items with AR model support
export const menuItems: MenuItem[] = [
  {
    id: "burger-deluxe",
    name: "AR Deluxe Burger",
    description:
      "Premium beef patty with aged cheddar, crispy bacon, fresh lettuce, tomato, and our signature sauce on a brioche bun",
    price: 18.99,
    image: "/images/Burger.jpg",
    category: "mains",
    restaurantId: "restaurant-1",
    model3D: "/models/burger.glb",
    allergens: ["gluten", "dairy"],
    spicyLevel: 1,
    isVegetarian: false,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "caesar-salad",
    name: "Interactive Caesar Salad",
    description:
      "Crisp romaine lettuce with parmesan cheese, herb croutons, and our house-made Caesar dressing",
    price: 12.99,
    image: "/images/Salad.jpg",
    category: "starters",
    restaurantId: "restaurant-1",
    model3D: "/models/salad.glb",
    allergens: ["dairy", "gluten"],
    isVegetarian: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "chocolate-cake",
    name: "3D Chocolate Dream",
    description:
      "Rich chocolate layer cake with ganache, served with berry compote",
    price: 9.99,
    image: "/images/Cake.jpg",
    category: "desserts",
    restaurantId: "restaurant-1",
    model3D: "/models/cake.glb",
    allergens: ["gluten", "dairy", "eggs"],
    isVegetarian: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "signature-cocktail",
    name: "AR Mixology Special",
    description:
      "Our signature cocktail with premium spirits and fresh ingredients",
    price: 14.99,
    image: "/images/Cocktail.jpg",
    category: "drinks",
    restaurantId: "restaurant-1",
    model3D: "/models/cocktail.glb",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "tiramisu",
    name: "AR Tiramisu",
    description:
      "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    price: 8.99,
    image: "/images/tiramisu.jpg",
    category: "desserts",
    restaurantId: "restaurant-1",
    model3D: "/models/tiramisu.glb",
    allergens: ["gluten", "dairy", "eggs"],
    isVegetarian: true,
    isActive: true,
    createdAt: new Date(),
  },
];

// Language support data
export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

// Utility functions for data filtering
export const getItemsByCategory = (categoryId: string): MenuItem[] => {
  return menuItems.filter((item) => item.category === categoryId);
};

export const searchItems = (query: string): MenuItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const getItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};

import { MenuItem, MenuCategory, Restaurant, RestaurantTheme } from "@/types";

// Mock database for multi-tenant restaurant system
// In production, replace with real database (MongoDB, PostgreSQL, etc.)

export const mockRestaurants: Restaurant[] = [
  {
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
      logo: "/images/bistro-logo.png",
    },
    createdAt: new Date(),
  },
  {
    id: "restaurant-2",
    name: "Cozy Café AR",
    description: "Artisanal coffee and pastries in AR",
    logo: "/images/cafe-logo.png",
    address: "456 Coffee Lane, Brew Town",
    phone: "+1 (555) 987-6543",
    website: "https://cozycafe.com",
    ownerId: "owner-2",
    isActive: true,
    subscriptionPlan: "basic",
    qrCodeSecret: "cafe-secret-456",
    customDomain: "cafe",
    theme: {
      primaryColor: "#8B4513",
      secondaryColor: "#D2691E",
      backgroundColor: "#FFF8DC",
      fontFamily: "Open Sans",
      logo: "/images/cafe-logo.png",
    },
    createdAt: new Date(),
  },
];

export const mockMenuCategories: MenuCategory[] = [
  // Bistro categories
  {
    id: "bistro-starters",
    name: "Starters",
    description: "Light bites to begin your journey",
    icon: "🥗",
    restaurantId: "restaurant-1",
    sortOrder: 1,
  },
  {
    id: "bistro-mains",
    name: "Main Course",
    description: "Hearty and satisfying dishes",
    icon: "🍖",
    restaurantId: "restaurant-1",
    sortOrder: 2,
  },
  {
    id: "bistro-desserts",
    name: "Desserts",
    description: "Sweet endings to your meal",
    icon: "🍰",
    restaurantId: "restaurant-1",
    sortOrder: 3,
  },
  {
    id: "bistro-drinks",
    name: "Beverages",
    description: "Refreshing drinks and cocktails",
    icon: "🍷",
    restaurantId: "restaurant-1",
    sortOrder: 4,
  },
  // Café categories
  {
    id: "cafe-coffee",
    name: "Coffee",
    description: "Artisanal coffee blends",
    icon: "☕",
    restaurantId: "restaurant-2",
    sortOrder: 1,
  },
  {
    id: "cafe-pastries",
    name: "Pastries",
    description: "Fresh baked goods",
    icon: "🥐",
    restaurantId: "restaurant-2",
    sortOrder: 2,
  },
  {
    id: "cafe-sandwiches",
    name: "Sandwiches",
    description: "Gourmet sandwiches and wraps",
    icon: "🥪",
    restaurantId: "restaurant-2",
    sortOrder: 3,
  },
];

export const mockMenuItems: MenuItem[] = [
  // Bistro items
  {
    id: "bistro-burger-deluxe",
    name: "AR Deluxe Burger",
    description:
      "Premium beef patty with aged cheddar, crispy bacon, fresh lettuce, tomato, and our signature sauce on a brioche bun",
    price: 18.99,
    image: "/images/Burger.jpg",
    category: "bistro-mains",
    restaurantId: "restaurant-1",
    model3D: "/models/burger.glb",
    allergens: ["gluten", "dairy"],
    spicyLevel: 1,
    isVegetarian: false,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "bistro-caesar-salad",
    name: "Interactive Caesar Salad",
    description:
      "Crisp romaine lettuce with parmesan cheese, herb croutons, and our house-made Caesar dressing",
    price: 12.99,
    image: "/images/Salad.jpg",
    category: "bistro-starters",
    restaurantId: "restaurant-1",
    model3D: "/models/salad.glb",
    allergens: ["dairy", "gluten"],
    isVegetarian: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "bistro-tiramisu",
    name: "AR Tiramisu",
    description:
      "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    price: 8.99,
    image: "/images/tiramisu.jpg",
    category: "bistro-desserts",
    restaurantId: "restaurant-1",
    model3D: "/models/tiramisu.glb",
    allergens: ["gluten", "dairy", "eggs"],
    isVegetarian: true,
    isActive: true,
    createdAt: new Date(),
  },
  // Café items
  {
    id: "cafe-espresso",
    name: "AR Signature Espresso",
    description: "Rich, aromatic espresso with perfect crema",
    price: 3.5,
    image: "/images/espresso.jpg",
    category: "cafe-coffee",
    restaurantId: "restaurant-2",
    model3D: "/models/coffee-cup.glb",
    isVegetarian: true,
    isVegan: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "cafe-croissant",
    name: "Buttery Croissant",
    description: "Flaky, buttery croissant baked fresh daily",
    price: 4.25,
    image: "/images/croissant.jpg",
    category: "cafe-pastries",
    restaurantId: "restaurant-2",
    model3D: "/models/croissant.glb",
    allergens: ["gluten", "dairy"],
    isVegetarian: true,
    isActive: true,
    createdAt: new Date(),
  },
];

// Database operations for restaurants
export async function getRestaurantById(
  id: string
): Promise<Restaurant | null> {
  return mockRestaurants.find((r) => r.id === id) || null;
}

export async function getRestaurantBySecret(
  secret: string
): Promise<Restaurant | null> {
  return mockRestaurants.find((r) => r.qrCodeSecret === secret) || null;
}

export async function getRestaurantByDomain(
  domain: string
): Promise<Restaurant | null> {
  return mockRestaurants.find((r) => r.customDomain === domain) || null;
}

export async function getRestaurantsByOwner(
  ownerId: string
): Promise<Restaurant[]> {
  return mockRestaurants.filter((r) => r.ownerId === ownerId && r.isActive);
}

// Database operations for menu items
export async function getMenuItemsByRestaurant(
  restaurantId: string
): Promise<MenuItem[]> {
  return mockMenuItems.filter(
    (item) => item.restaurantId === restaurantId && item.isActive
  );
}

export async function getMenuItemById(
  id: string,
  restaurantId: string
): Promise<MenuItem | null> {
  return (
    mockMenuItems.find(
      (item) => item.id === id && item.restaurantId === restaurantId
    ) || null
  );
}

export async function getMenuItemsByCategory(
  categoryId: string,
  restaurantId: string
): Promise<MenuItem[]> {
  return mockMenuItems.filter(
    (item) =>
      item.category === categoryId &&
      item.restaurantId === restaurantId &&
      item.isActive
  );
}

export async function searchMenuItems(
  query: string,
  restaurantId: string
): Promise<MenuItem[]> {
  const lowercaseQuery = query.toLowerCase();
  return mockMenuItems.filter(
    (item) =>
      item.restaurantId === restaurantId &&
      item.isActive &&
      (item.name.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery))
  );
}

// Database operations for categories
export async function getCategoriesByRestaurant(
  restaurantId: string
): Promise<MenuCategory[]> {
  return mockMenuCategories
    .filter((cat) => cat.restaurantId === restaurantId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

// Database operations for menu management (admin)
export async function createMenuItem(
  item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
): Promise<MenuItem> {
  const newItem: MenuItem = {
    ...item,
    id: `${item.restaurantId}-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockMenuItems.push(newItem);
  return newItem;
}

export async function updateMenuItem(
  id: string,
  restaurantId: string,
  updates: Partial<MenuItem>
): Promise<MenuItem | null> {
  const index = mockMenuItems.findIndex(
    (item) => item.id === id && item.restaurantId === restaurantId
  );
  if (index === -1) return null;

  mockMenuItems[index] = {
    ...mockMenuItems[index],
    ...updates,
    updatedAt: new Date(),
  };

  return mockMenuItems[index];
}

export async function deleteMenuItem(
  id: string,
  restaurantId: string
): Promise<boolean> {
  const index = mockMenuItems.findIndex(
    (item) => item.id === id && item.restaurantId === restaurantId
  );
  if (index === -1) return false;

  // Soft delete
  mockMenuItems[index].isActive = false;
  mockMenuItems[index].updatedAt = new Date();
  return true;
}

export async function createMenuCategory(
  category: Omit<MenuCategory, "id">
): Promise<MenuCategory> {
  const newCategory: MenuCategory = {
    ...category,
    id: `${category.restaurantId}-${category.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
  };

  mockMenuCategories.push(newCategory);
  return newCategory;
}

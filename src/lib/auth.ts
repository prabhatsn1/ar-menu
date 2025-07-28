import { RestaurantOwner } from "@/types";

// Mock database - replace with real database in production
const mockUsers: RestaurantOwner[] = [
  {
    id: "owner-1",
    email: "owner@deliciousbistro.com",
    name: "John Smith",
    restaurants: ["restaurant-1"],
    role: "owner",
    permissions: [
      { action: "admin", resource: "menu" },
      { action: "admin", resource: "restaurant" },
      { action: "admin", resource: "analytics" },
      { action: "admin", resource: "settings" },
    ],
    createdAt: new Date(),
  },
  {
    id: "owner-2",
    email: "cafe@example.com",
    name: "Jane Doe",
    restaurants: ["restaurant-2"],
    role: "owner",
    permissions: [
      { action: "admin", resource: "menu" },
      { action: "admin", resource: "restaurant" },
      { action: "admin", resource: "analytics" },
      { action: "admin", resource: "settings" },
    ],
    createdAt: new Date(),
  },
  {
    id: "manager-1",
    email: "manager@deliciousbistro.com",
    name: "Mike Johnson",
    restaurants: ["restaurant-1"],
    role: "manager",
    permissions: [
      { action: "write", resource: "menu" },
      { action: "read", resource: "restaurant" },
      { action: "read", resource: "analytics" },
      { action: "write", resource: "settings" },
    ],
    createdAt: new Date(),
  },
];

/**
 * Mock authentication function
 * In production, this would verify against a real database with hashed passwords
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<RestaurantOwner> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = mockUsers.find((u) => u.email === email);

  // Mock password validation - in production, use proper password hashing
  if (!user || password !== "password123") {
    throw new Error("Invalid credentials");
  }

  return user;
}

/**
 * Get restaurants associated with a user
 */
export async function getUserRestaurants(userId: string): Promise<string[]> {
  const user = mockUsers.find((u) => u.id === userId);
  return user?.restaurants || [];
}

/**
 * Check if user has permission for specific action on resource
 */
export async function hasPermission(
  userId: string,
  action: string,
  resource: string
): Promise<boolean> {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return false;

  return user.permissions.some(
    (p) =>
      (p.action === action || p.action === "admin") && p.resource === resource
  );
}

/**
 * Get current user from localStorage (mock session)
 * In production, this would use proper session management
 */
export function getCurrentUser(): RestaurantOwner | null {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

/**
 * Store user session in localStorage (mock session)
 * In production, this would use proper session management
 */
export function setCurrentUser(user: RestaurantOwner): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("currentUser", JSON.stringify(user));
}

/**
 * Clear user session
 */
export function clearCurrentUser(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("currentUser");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

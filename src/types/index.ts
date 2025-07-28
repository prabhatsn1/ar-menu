// TypeScript interfaces for the restaurant menu application

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  model3D?: string; // Path to 3D model (GLTF/GLB)
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  spicyLevel?: number; // 0-3 scale
  restaurantId: string; // NEW: Link to restaurant
  isActive?: boolean; // NEW: Enable/disable items
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  restaurantId: string; // NEW: Link to restaurant
  sortOrder?: number; // NEW: Custom ordering
}

export interface Restaurant {
  id: string; // NEW: Unique identifier
  name: string;
  description: string;
  logo?: string;
  address?: string;
  phone?: string;
  website?: string;
  ownerId: string; // NEW: Link to owner
  isActive?: boolean; // NEW: Enable/disable restaurant
  subscriptionPlan?: "basic" | "premium" | "enterprise"; // NEW: Subscription tiers
  qrCodeSecret?: string; // NEW: Unique QR code identifier
  customDomain?: string; // NEW: Custom subdomain
  theme?: RestaurantTheme; // NEW: Custom styling
  createdAt?: Date;
  updatedAt?: Date;
}

// NEW: Restaurant owner/admin interface
export interface RestaurantOwner {
  id: string;
  email: string;
  name: string;
  restaurants: string[]; // Array of restaurant IDs
  role: "owner" | "manager" | "staff";
  permissions: Permission[];
  createdAt?: Date;
}

// NEW: Permission system
export interface Permission {
  action: "read" | "write" | "delete" | "admin";
  resource: "menu" | "restaurant" | "analytics" | "settings";
}

// NEW: Theme customization
export interface RestaurantTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  logo?: string;
  bannerImage?: string;
}

// NEW: Analytics tracking
export interface MenuAnalytics {
  id: string;
  restaurantId: string;
  itemId?: string;
  action: "view" | "ar_view" | "qr_scan" | "share";
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
}

export interface ARViewerProps {
  modelPath: string;
  itemName: string;
  onClose: () => void;
  open: boolean;
}

export interface QRCodeData {
  type: "menu" | "item" | "ar";
  restaurantId: string; // NEW: Restaurant context
  itemId?: string;
  url: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

// Component props interfaces
export interface MenuCardProps {
  item: MenuItem;
  onViewAR: (item: MenuItem) => void;
  onShowQR: (item: MenuItem) => void;
}

export interface CategoryFilterProps {
  categories: MenuCategory[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export interface ARInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
  deviceType: "mobile" | "desktop";
}

export interface LanguageDialogProps {
  open: boolean;
  onClose: () => void;
  currentLanguage?: string;
  onLanguageChange: (languageCode: string) => void;
}

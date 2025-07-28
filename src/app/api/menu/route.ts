/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import {
  getMenuItemsByRestaurant,
  getCategoriesByRestaurant,
  getRestaurantById,
  getRestaurantBySecret,
  getMenuItemById,
  searchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/database";

/**
 * Multi-Tenant Menu API Route
 * Provides REST endpoints for restaurant-specific menu data
 * Supports filtering by restaurant, category, search, and individual item retrieval
 */

// GET /api/menu - Get menu items for a specific restaurant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");
    const restaurantSecret = searchParams.get("r"); // QR code secret
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const itemId = searchParams.get("id");
    const includeInfo = searchParams.get("includeInfo") === "true";

    // Determine restaurant ID from either direct ID or secret
    let targetRestaurantId = restaurantId;
    let restaurant = null;

    if (restaurantSecret) {
      restaurant = await getRestaurantBySecret(restaurantSecret);
      if (!restaurant) {
        return NextResponse.json(
          { error: "Restaurant not found" },
          { status: 404 }
        );
      }
      targetRestaurantId = restaurant.id;
    } else if (restaurantId) {
      restaurant = await getRestaurantById(restaurantId);
      if (!restaurant) {
        return NextResponse.json(
          { error: "Restaurant not found" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error: "Restaurant identifier required (restaurantId or r parameter)",
        },
        { status: 400 }
      );
    }

    // Ensure we have a valid restaurant ID at this point
    if (!targetRestaurantId) {
      return NextResponse.json(
        { error: "Invalid restaurant identifier" },
        { status: 400 }
      );
    }

    // Check if restaurant is active
    if (!restaurant?.isActive) {
      return NextResponse.json(
        { error: "Restaurant is not currently available" },
        { status: 403 }
      );
    }

    // Get single item by ID
    if (itemId) {
      const item = await getMenuItemById(itemId, targetRestaurantId);
      if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      return NextResponse.json({
        item,
        restaurant: includeInfo ? restaurant : undefined,
      });
    }

    let items = await getMenuItemsByRestaurant(targetRestaurantId);

    // Filter by category
    if (category && category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    // Search functionality
    if (search) {
      items = await searchMenuItems(search, targetRestaurantId);
    }

    // Get categories
    const categories = await getCategoriesByRestaurant(targetRestaurantId);

    // Build response
    interface MenuResponse {
      items: any[];
      categories: any[];
      total: number;
      restaurant?: any;
    }

    const response: MenuResponse = {
      items,
      categories,
      total: items.length,
    };

    // Include restaurant info if requested
    if (includeInfo) {
      response.restaurant = restaurant;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Menu API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/menu - Add new menu item (admin only)
export async function POST(request: NextRequest) {
  try {
    const newItem = await request.json();
    const { restaurantId } = newItem;

    // Basic validation
    if (!newItem.name || !newItem.price || !newItem.category || !restaurantId) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, price, category, restaurantId",
        },
        { status: 400 }
      );
    }

    // Verify restaurant exists
    const restaurant = await getRestaurantById(restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Create the item
    const createdItem = await createMenuItem({
      name: newItem.name,
      description: newItem.description || "",
      price: parseFloat(newItem.price),
      image: newItem.image || "/images/placeholder-food.jpg",
      category: newItem.category,
      restaurantId: restaurantId,
      model3D: newItem.model3D || undefined,
      allergens: newItem.allergens || [],
      isVegetarian: newItem.isVegetarian || false,
      isVegan: newItem.isVegan || false,
      spicyLevel: newItem.spicyLevel || 0,
    });

    return NextResponse.json(
      { message: "Item created successfully", item: createdItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Menu API POST Error:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

// PUT /api/menu - Update menu item (admin only)
export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    const { id, restaurantId } = updates;

    if (!id || !restaurantId) {
      return NextResponse.json(
        { error: "Missing required fields: id, restaurantId" },
        { status: 400 }
      );
    }

    const updatedItem = await updateMenuItem(id, restaurantId, updates);

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Menu API PUT Error:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

// DELETE /api/menu - Delete menu item (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const restaurantId = searchParams.get("restaurantId");

    if (!id || !restaurantId) {
      return NextResponse.json(
        { error: "Missing required parameters: id, restaurantId" },
        { status: 400 }
      );
    }

    const success = await deleteMenuItem(id, restaurantId);

    if (!success) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Menu API DELETE Error:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

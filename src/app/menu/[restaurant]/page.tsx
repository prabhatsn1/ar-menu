"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Fab,
} from "@mui/material";
import {
  Search as SearchIcon,
  Restaurant as RestaurantIcon,
  QrCode as QrCodeIcon,
  Language as LanguageIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  ViewInAr as ViewInArIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { MenuItem, MenuCategory, Restaurant } from "@/types";
import { MenuCard } from "@/components/MenuCard";
import { ARViewer } from "@/components/ARViewer";
import { QRCodeDialog } from "@/components/QRCodeDialog";
import { LanguageDialog } from "@/components/LanguageDialog";
import { RestaurantInfoDialog } from "@/components/RestaurantInfoDialog";

/**
 * Dynamic Restaurant Menu Page
 * Accessible via QR code scan with restaurant-specific content
 * URL pattern: /menu/[restaurant]?r=secret or /menu/[restaurant]?restaurantId=id
 */
export default function RestaurantMenuPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Get restaurant identifier from URL params or query
  const restaurantSecret = searchParams.get("r");
  const restaurantId = searchParams.get("restaurantId");

  // State management
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [arViewerOpen, setArViewerOpen] = useState(false);
  const [selectedArItem, setSelectedArItem] = useState<MenuItem | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedQrItem, setSelectedQrItem] = useState<MenuItem | null>(null);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [restaurantInfoOpen, setRestaurantInfoOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const loadRestaurantMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build API URL based on what we have
      const params = new URLSearchParams();
      if (restaurantId) {
        params.append("restaurantId", restaurantId);
      } else if (restaurantSecret) {
        params.append("r", restaurantSecret);
      } else {
        throw new Error("No restaurant identifier provided");
      }
      params.append("includeInfo", "true");

      const response = await fetch(`/api/menu?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load menu");
      }

      setMenuItems(data.items || []);
      setMenuCategories(data.categories || []);
      setRestaurant(data.restaurant);
    } catch (err) {
      console.error("Error loading menu:", err);
      setError(err instanceof Error ? err.message : "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, [restaurantId, restaurantSecret]);

  useEffect(() => {
    loadRestaurantMenu();
  }, [loadRestaurantMenu]);

  // Helper function for fuzzy search matching
  const fuzzyMatch = (text: string, search: string) => {
    const str = text.toLowerCase();
    const searchStr = search.toLowerCase();
    const len = searchStr.length;
    let i = 0;
    let j = 0;

    while (i < str.length && j < len) {
      if (str[i] === searchStr[j]) {
        j++;
      }
      i++;
    }
    return j === len;
  };

  // Filter menu items based on search and category
  const filteredItems = useMemo(() => {
    let items = menuItems;

    // Filter by category
    if (selectedCategory) {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Filter by search term with fuzzy matching
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase().trim();
      items = items.filter(
        (item) =>
          fuzzyMatch(item.name, lowercaseSearch) ||
          fuzzyMatch(item.description, lowercaseSearch) ||
          fuzzyMatch(item.category, lowercaseSearch) ||
          item.allergens?.some((allergen) =>
            fuzzyMatch(allergen, lowercaseSearch)
          ) ||
          (item.isVegetarian && fuzzyMatch("vegetarian", lowercaseSearch)) ||
          (item.isVegan && fuzzyMatch("vegan", lowercaseSearch))
      );
    }

    return items;
  }, [searchTerm, selectedCategory, menuItems]);

  // Handle AR viewing
  const handleViewAR = (item: MenuItem) => {
    if (item.model3D) {
      setSelectedArItem(item);
      setArViewerOpen(true);
    }
  };

  // Handle QR code generation
  const handleShowQR = (item: MenuItem) => {
    setSelectedQrItem(item);
    setQrDialogOpen(true);
  };

  // Generate menu QR code
  const handleMenuQR = () => {
    if (!restaurant) return;

    const menuItem: MenuItem = {
      id: "full-menu",
      name: "Complete Menu",
      description: `View ${restaurant.name}'s complete menu`,
      price: 0,
      image: "",
      category: "menu",
      restaurantId: restaurant.id,
    };
    setSelectedQrItem(menuItem);
    setQrDialogOpen(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading restaurant menu...
        </Typography>
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa", p: 4 }}>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Restaurant Not Found
            </Typography>
            <Typography variant="body2">
              {error ||
                "The restaurant you're looking for is not available. Please check your QR code or link."}
            </Typography>
          </Alert>
          <Typography variant="body2" color="text.secondary">
            If you believe this is an error, please contact the restaurant
            directly.
          </Typography>
        </Container>
      </Box>
    );
  }

  // Apply restaurant theme if available
  const restaurantTheme = restaurant.theme;

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: restaurantTheme?.backgroundColor || "#f8f9fa",
      }}
    >
      {/* App Bar with Restaurant Branding */}
      <AppBar
        position="sticky"
        sx={{
          background: restaurantTheme
            ? `linear-gradient(135deg, ${restaurantTheme.primaryColor} 0%, ${restaurantTheme.secondaryColor} 100%)`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: 3,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <RestaurantIcon sx={{ mr: 2, fontSize: "2rem" }} />
            <Box>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
                {restaurant.name}
              </Typography>
              {!isMobile && (
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {restaurant.description}
                </Typography>
              )}
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Menu QR Code">
              <IconButton color="inherit" onClick={handleMenuQR}>
                <QrCodeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Language Settings">
              <IconButton
                color="inherit"
                onClick={() => setLanguageDialogOpen(true)}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Restaurant Info">
              <IconButton
                color="inherit"
                onClick={() => setRestaurantInfoOpen(true)}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="User Guide">
              <IconButton color="inherit" onClick={() => router.push("/guide")}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search and Filter Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          {/* Search Bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Category Filters */}
          <Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Categories
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label="All Items"
                onClick={() => setSelectedCategory(null)}
                color={selectedCategory === null ? "primary" : "default"}
                variant={selectedCategory === null ? "filled" : "outlined"}
                sx={{ fontWeight: 500 }}
              />
              {menuCategories.map((category) => (
                <Chip
                  key={category.id}
                  label={`${category.icon} ${category.name}`}
                  onClick={() => setSelectedCategory(category.id)}
                  color={
                    selectedCategory === category.id ? "primary" : "default"
                  }
                  variant={
                    selectedCategory === category.id ? "filled" : "outlined"
                  }
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          </Box>

          {/* Results Counter */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Showing {filteredItems.length} of {menuItems.length} items
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory &&
              ` in ${
                menuCategories.find((c) => c.id === selectedCategory)?.name
              }`}
          </Typography>
        </Paper>

        {/* Menu Items Grid */}
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
              <MenuCard
                item={item}
                onViewAR={handleViewAR}
                onShowQR={handleShowQR}
              />
            </Grid>
          ))}
        </Grid>

        {/* No Results Message */}
        {filteredItems.length === 0 && (
          <Paper
            elevation={1}
            sx={{
              p: 6,
              textAlign: "center",
              mt: 4,
              backgroundColor: "#f5f5f5",
            }}
          >
            <SearchIcon
              sx={{ fontSize: "4rem", color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom color="text.secondary">
              No items found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or browse different categories
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Floating AR Button */}
      <Fab
        color="primary"
        aria-label="AR View"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
        }}
        onClick={() => {
          const arItem = menuItems.find((item) => item.model3D);
          if (arItem) handleViewAR(arItem);
        }}
      >
        <ViewInArIcon />
      </Fab>

      {/* AR Viewer Dialog */}
      <ARViewer
        open={arViewerOpen}
        onClose={() => setArViewerOpen(false)}
        modelPath={selectedArItem?.model3D || ""}
        itemName={selectedArItem?.name || ""}
      />

      {/* QR Code Dialog */}
      <QRCodeDialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        item={selectedQrItem}
      />

      {/* Language Dialog */}
      <LanguageDialog
        open={languageDialogOpen}
        onClose={() => setLanguageDialogOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Restaurant Info Dialog */}
      <RestaurantInfoDialog
        open={restaurantInfoOpen}
        onClose={() => setRestaurantInfoOpen(false)}
      />
    </Box>
  );
}

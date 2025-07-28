/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  ViewInAr as ViewInArIcon,
  QrCode as QrCodeIcon,
  LocalFlorist as VeganIcon,
  Grass as VegetarianIcon,
  Grass,
  LocalFlorist,
} from "@mui/icons-material";
import { MenuCardProps } from "@/types";
import { useTheme } from "@mui/material/styles";
import menuData from "@/data/menu_mock.json";

/**
 * MenuCard component displays a single menu item using mock JSON data
 * Features: Item details, price, dietary info, AR view button, QR code generation
 */
export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onViewAR,
  onShowQR,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  // Helper function to get icon component based on string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      view_in_ar: <ViewInArIcon />,
      qr_code: <QrCodeIcon />,
      info: <QrCodeIcon />,
    };
    return iconMap[iconName] || <QrCodeIcon />;
  };

  // Format price with proper currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    // Fallback to placeholder if image fails to load
    const target = e.target as HTMLImageElement;
    target.src = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1381&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  };

  // Render spicy level indicators using mock data
  const renderSpicyLevel = (level: number) => {
    const spicyText =
      menuData.menuCard.spicyLevels[
        level.toString() as keyof typeof menuData.menuCard.spicyLevels
      ];
    return spicyText || "";
  };

  // Get badge configuration from mock data
  const getBadgeConfig = (badgeType: string) => {
    return menuData.menuCard.badges[
      badgeType as keyof typeof menuData.menuCard.badges
    ];
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
      role="article"
      aria-label={`Menu item: ${item.name}`}
    >
      {/* Item Image with Loading Skeleton */}
      <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
        <CardMedia
          component="img"
          image={imageError ? "/images/placeholder-food.jpg" : item.image}
          alt={`${item.name} - delicious dish`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#f5f5f5",
            filter: !imageLoaded ? "blur(10px)" : "none",
            transition: "filter 0.3s ease-in-out",
          }}
        />
        {!imageLoaded && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}

        {/* Dietary Indicators */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 0.5,
          }}
        >
          {item.isVegetarian && (
            <Chip
              size="small"
              icon={<Grass />}
              label={getBadgeConfig("vegetarian").label}
              color={getBadgeConfig("vegetarian").color as any}
              sx={{ opacity: 0.9 }}
            />
          )}
          {item.isVegan && (
            <Chip
              size="small"
              icon={<LocalFlorist />}
              label={getBadgeConfig("vegan").label}
              color={getBadgeConfig("vegan").color as any}
              sx={{ opacity: 0.9 }}
            />
          )}
        </Box>

        {/* AR Model Indicator */}
        {item.model3D && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              padding: "4px 8px",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <ViewInArIcon fontSize="small" />
            <Typography variant="caption">
              {getBadgeConfig("arAvailable").label}
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Item Name and Price */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{ fontWeight: 600, flexGrow: 1 }}
          >
            {item.name}
          </Typography>
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: 700, ml: 1 }}
          >
            {formatPrice(item.price)}
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flexGrow: 1 }}
        >
          {item.description}
        </Typography>

        {/* Dietary Information and Spicy Level */}
        <Box mb={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
            {item.isVegan && (
              <Chip
                icon={<VeganIcon />}
                label={getBadgeConfig("vegan").label}
                size="small"
                color={getBadgeConfig("vegan").color as any}
                variant="outlined"
              />
            )}
            {item.isVegetarian && !item.isVegan && (
              <Chip
                icon={<VegetarianIcon />}
                label={getBadgeConfig("vegetarian").label}
                size="small"
                color={getBadgeConfig("vegetarian").color as any}
                variant="outlined"
              />
            )}
            {item.spicyLevel && item.spicyLevel > 0 && (
              <Chip
                label={renderSpicyLevel(item.spicyLevel)}
                size="small"
                color={getBadgeConfig("spicy").color as any}
                variant="outlined"
              />
            )}
          </Stack>

          {/* Allergen Information */}
          {item.allergens && item.allergens.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              Contains: {item.allergens.join(", ")}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          {menuData.menuCard.actions.map((action, index) => {
            if (
              action.type === "ar" &&
              action.condition === "hasModel3D" &&
              !item.model3D
            ) {
              return null;
            }

            if (action.iconButton) {
              return (
                <Tooltip key={index} title={action.tooltip || action.text}>
                  <IconButton
                    onClick={() =>
                      action.type === "qr" ? onShowQR(item) : undefined
                    }
                    color="primary"
                    sx={{
                      "&:hover": {
                        backgroundColor: "primary.light",
                        color: "white",
                      },
                    }}
                    aria-label={action.tooltip || action.text}
                  >
                    {getIconComponent(action.icon)}
                  </IconButton>
                </Tooltip>
              );
            }

            return (
              <Button
                key={index}
                variant={(action.variant as any) || "contained"}
                startIcon={getIconComponent(action.icon)}
                onClick={() => {
                  if (action.type === "ar") {
                    onViewAR(item);
                  } else if (action.type === "qr") {
                    onShowQR(item);
                  }
                }}
                disabled={action.type === "ar" && !item.model3D}
                sx={{
                  background: (action as any).gradient
                    ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
                    : undefined,
                  color: (action as any).gradient ? "white" : undefined,
                  "&:hover": (action as any).gradient
                    ? {
                        background:
                          "linear-gradient(45deg, #FF5252 30%, #26A69A 90%)",
                      }
                    : undefined,
                  "&:disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
                aria-label={`${action.text} for ${item.name}`}
              >
                {action.text}
              </Button>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

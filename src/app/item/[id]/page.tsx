"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ViewInAr as ViewInArIcon,
  QrCode as QrCodeIcon,
  LocalFireDepartment as SpicyIcon,
  LocalFlorist as VeganIcon,
  Grass as VegetarianIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { MenuItem } from "@/types";
import { getItemById } from "@/data/menuData";
import { ARViewer } from "@/components/ARViewer";
import { QRCodeDialog } from "@/components/QRCodeDialog";

/**
 * Individual Item Page - Display detailed view of a single menu item
 * Accessible via QR code scan or direct link sharing
 */
export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [arViewerOpen, setArViewerOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        const foundItem = getItemById(itemId);

        if (!foundItem) {
          setError("Item not found");
          return;
        }

        setItem(foundItem);
      } catch (err) {
        console.error("Error loading item:", err);
        setError("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      loadItem();
    }
  }, [itemId]);

  const handleShare = async () => {
    if (navigator.share && item) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out ${item.name} at our restaurant!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderSpicyLevel = (level: number) => {
    return Array.from({ length: 3 }, (_, index) => (
      <SpicyIcon
        key={index}
        sx={{
          fontSize: "1.2rem",
          color: index < level ? "#ff5722" : "#e0e0e0",
        }}
      />
    ));
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton color="inherit" onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <Skeleton variant="text" width={200} height={32} sx={{ ml: 2 }} />
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card>
            <Skeleton variant="rectangular" height={400} />
            <CardContent>
              <Skeleton variant="text" height={40} width="70%" />
              <Skeleton variant="text" height={24} width="30%" />
              <Skeleton variant="text" height={60} />
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  if (error || !item) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton color="inherit" onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">Menu Item</Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "Item not found"}
          </Alert>
          <Button variant="contained" onClick={() => router.push("/")}>
            Back to Menu
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* App Bar */}
      <AppBar position="sticky">
        <Toolbar>
          <IconButton color="inherit" onClick={() => router.back()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            {item.name}
          </Typography>
          <IconButton color="inherit" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
          {/* Item Image */}
          <CardMedia
            component="img"
            height="400"
            image={item.image}
            alt={item.name}
            sx={{ objectFit: "cover" }}
          />

          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={3}
            >
              <Box flexGrow={1}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  {formatPrice(item.price)}
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
            >
              {item.description}
            </Typography>

            {/* Dietary Information */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Dietary Information
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                {item.isVegan && (
                  <Chip
                    icon={<VeganIcon />}
                    label="Vegan"
                    color="success"
                    variant="filled"
                  />
                )}
                {item.isVegetarian && !item.isVegan && (
                  <Chip
                    icon={<VegetarianIcon />}
                    label="Vegetarian"
                    color="info"
                    variant="filled"
                  />
                )}
                {item.spicyLevel && item.spicyLevel > 0 && (
                  <Chip
                    icon={
                      <Box display="flex" alignItems="center">
                        {renderSpicyLevel(item.spicyLevel)}
                      </Box>
                    }
                    label={`Spicy Level ${item.spicyLevel}/3`}
                    color="warning"
                    variant="filled"
                  />
                )}
              </Stack>

              {/* Allergen Information */}
              {item.allergens && item.allergens.length > 0 && (
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffeaa7",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="warning.dark"
                    gutterBottom
                  >
                    ⚠️ Allergen Information
                  </Typography>
                  <Typography variant="body2" color="warning.dark">
                    Contains: {item.allergens.join(", ")}
                  </Typography>
                </Paper>
              )}
            </Box>

            {/* Action Buttons */}
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ViewInArIcon />}
                onClick={() => setArViewerOpen(true)}
                disabled={!item.model3D}
                sx={{
                  background:
                    "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
                  color: "white",
                  py: 1.5,
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #FF5252 30%, #26A69A 90%)",
                  },
                  "&:disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                {item.model3D ? "View in AR" : "AR Not Available"}
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<QrCodeIcon />}
                onClick={() => setQrDialogOpen(true)}
                sx={{ py: 1.5 }}
              >
                Generate QR Code
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push("/")}
                sx={{ py: 1.5 }}
              >
                Back to Menu
              </Button>
            </Stack>

            {/* AR Info */}
            {item.model3D && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>AR Experience Available!</strong>
                  <br />
                  Tap &quot;View in AR&quot; to see this item in augmented reality. Make
                  sure to allow camera access when prompted.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* AR Viewer Dialog */}
      <ARViewer
        open={arViewerOpen}
        onClose={() => setArViewerOpen(false)}
        modelPath={item.model3D || ""}
        itemName={item.name}
      />

      {/* QR Code Dialog */}
      <QRCodeDialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        item={item}
      />
    </Box>
  );
}

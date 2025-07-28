"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Alert,
  Button,
  Container,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { MenuItem } from "@/types";
import { getItemById } from "@/data/menuData";
import { ARViewer } from "@/components/ARViewer";

/**
 * Direct AR Experience Page - Launches AR viewer immediately for a specific item
 * Accessible via QR code for instant AR access
 */
export default function ARPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        const foundItem = getItemById(itemId);

        if (!foundItem) {
          setError("Item not found");
          return;
        }

        if (!foundItem.model3D) {
          setError("AR experience not available for this item");
          return;
        }

        setItem(foundItem);
      } catch (err) {
        console.error("Error loading item:", err);
        setError("Failed to load AR experience");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      loadItem();
    }
  }, [itemId]);

  const handleClose = () => {
    // Navigate to item details page instead of closing
    router.push(`/item/${itemId}`);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#000" }}>
        <AppBar position="sticky" sx={{ backgroundColor: "#000" }}>
          <Toolbar>
            <IconButton color="inherit" onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
              AR Experience
            </Typography>
            <IconButton color="inherit" onClick={() => router.push("/")}>
              <HomeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h6" color="textSecondary" align="center">
            Loading AR experience...
          </Typography>
        </Container>
      </Box>
    );
  }

  if (error || !item) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#000" }}>
        <AppBar position="sticky" sx={{ backgroundColor: "#000" }}>
          <Toolbar>
            <IconButton color="inherit" onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
              AR Experience
            </Typography>
            <IconButton color="inherit" onClick={() => router.push("/")}>
              <HomeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "AR experience not available"}
          </Alert>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={() => router.push(`/item/${itemId}`)}
            >
              View Item Details
            </Button>
            <Button variant="outlined" onClick={() => router.push("/")}>
              Back to Menu
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#000" }}>
      {/* Minimal header for AR mode */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={handleClose}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            AR: {item.name}
          </Typography>
          <IconButton color="inherit" onClick={() => router.push("/")}>
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Full-screen AR Viewer */}
      <Box sx={{ height: "calc(100vh - 64px)" }}>
        <ARViewer
          open={true}
          onClose={handleClose}
          modelPath={item.model3D || ""}
          itemName={item.name}
        />
      </Box>

      {/* AR Instructions Overlay */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Alert
          severity="info"
          sx={{
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="body2">
            <strong>AR Mode Active</strong> - Point your camera at a flat
            surface or AR marker to view {item.name} in 3D
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}

"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Restaurant as RestaurantIcon,
} from "@mui/icons-material";
import { restaurantInfo } from "@/data/menuData";

interface RestaurantInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * RestaurantInfoDialog component displays restaurant details and contact information
 * Includes address, phone, website, and business information
 */
export const RestaurantInfoDialog: React.FC<RestaurantInfoDialogProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Box display="flex" alignItems="center">
          <RestaurantIcon sx={{ mr: 2, color: "primary.main" }} />
          <Typography variant="h6">Restaurant Information</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Restaurant Name & Description */}
        <Box mb={3}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {restaurantInfo.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {restaurantInfo.description}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Contact Information */}
        <Stack spacing={3}>
          {/* Address */}
          {restaurantInfo.address && (
            <Box display="flex" alignItems="flex-start">
              <LocationIcon sx={{ mr: 2, mt: 0.5, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {restaurantInfo.address}
                </Typography>
                <Link
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    restaurantInfo.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: "0.875rem" }}
                >
                  View on Google Maps
                </Link>
              </Box>
            </Box>
          )}

          {/* Phone */}
          {restaurantInfo.phone && (
            <Box display="flex" alignItems="flex-start">
              <PhoneIcon sx={{ mr: 2, mt: 0.5, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Phone
                </Typography>
                <Link
                  href={`tel:${restaurantInfo.phone}`}
                  sx={{ textDecoration: "none" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {restaurantInfo.phone}
                  </Typography>
                </Link>
              </Box>
            </Box>
          )}

          {/* Website */}
          {restaurantInfo.website && (
            <Box display="flex" alignItems="flex-start">
              <WebsiteIcon sx={{ mr: 2, mt: 0.5, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Website
                </Typography>
                <Link
                  href={restaurantInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <Typography variant="body2" color="primary.main">
                    Visit Our Website
                  </Typography>
                </Link>
              </Box>
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* AR Menu Info */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            About Our AR Menu
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Experience our dishes in augmented reality before you order! Simply
            scan the QR codes on our menu items to view them in 3D right on your
            table.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>How it works:</strong>
            <br />
            • Scan QR codes with your phone camera
            <br />
            • Allow camera access when prompted
            <br />
            • Point your phone at a flat surface
            <br />• Watch your food come to life in AR!
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import { MenuItem } from "@/types";
import menuData from "@/data/menu_mock.json";

interface QRCodeDialogProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

/**
 * QRCodeDialog component generates and displays QR codes using mock JSON data
 * Supports different QR code types: item details, AR view, and menu link
 */
export const QRCodeDialog: React.FC<QRCodeDialogProps> = ({
  item,
  open,
  onClose,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  // Reset tab when dialog opens
  useEffect(() => {
    if (open) {
      setTabValue(0);
      setCopySuccess(false);
    }
  }, [open]);

  if (!item) return null;

  // Generate different URLs for QR codes
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const itemUrl = `${baseUrl}/item/${item.id}`;
  const arUrl = `${baseUrl}/ar/${item.id}`;
  const menuUrl = `${baseUrl}`;

  const qrData = [
    {
      label: "Item Details",
      url: itemUrl,
      description: "View item details and information",
    },
    {
      label: "AR Experience",
      url: arUrl,
      description: "Launch AR view directly",
      disabled: !item.model3D,
    },
    {
      label: "Full Menu",
      url: menuUrl,
      description: "View complete restaurant menu",
    },
  ];

  const currentQRData = qrData[tabValue];

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentQRData.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // Download QR code as SVG
  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${item.name}-${qrData[tabValue].label
        .toLowerCase()
        .replace(" ", "-")}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Share QR code (if Web Share API is available)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.name} - ${qrData[tabValue].label}`,
          text: `Check out ${item.name} at our restaurant!`,
          url: currentQRData.url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
        // Fallback to copy URL
        handleCopyUrl();
      }
    } else {
      // Fallback to copy URL
      handleCopyUrl();
    }
  };

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
          pb: 1,
        }}
      >
        <Typography variant="inherit" component="span">
          {menuData.dialogs.qrCode.title.replace("{itemName}", item.name)}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {menuData.dialogs.qrCode.subtitle}
        </Typography>

        {/* QR Code Type Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          {qrData.map((data, index) => (
            <Tab
              key={index}
              label={data.label}
              disabled={data.disabled}
              sx={{ fontSize: "0.875rem" }}
            />
          ))}
        </Tabs>

        {/* QR Code Display */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
          }}
        >
          <QRCodeSVG
            id="qr-code-svg"
            value={currentQRData.url}
            size={200}
            level="M"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 2, maxWidth: "250px" }}
          >
            {currentQRData.description}
          </Typography>
        </Paper>

        {/* URL Display */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            URL:
          </Typography>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                wordBreak: "break-all",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {currentQRData.url}
            </Typography>
          </Paper>
        </Box>

        {/* Copy Success Alert */}
        {copySuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            URL copied to clipboard!
          </Alert>
        )}

        {/* Instructions */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>How to use:</strong>
            <br />
            1. Download or share this QR code
            <br />
            2. Customers can scan it with their phone camera
            <br />
            3. They&apos;ll be taken directly to the{" "}
            {currentQRData.label.toLowerCase()}
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          startIcon={<CopyIcon />}
          onClick={handleCopyUrl}
          variant="outlined"
          size="small"
        >
          Copy URL
        </Button>

        <Button
          startIcon={<ShareIcon />}
          onClick={handleShare}
          variant="outlined"
          size="small"
        >
          {menuData.dialogs.qrCode.shareButton}
        </Button>

        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownloadQR}
          variant="contained"
          size="small"
        >
          {menuData.dialogs.qrCode.downloadButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

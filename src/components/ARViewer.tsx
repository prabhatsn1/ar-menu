"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  Help as HelpIcon,
} from "@mui/icons-material";
import { ARViewerProps } from "@/types";

/**
 * ARViewer component provides WebAR functionality using A-Frame and AR.js
 * Displays 3D models in augmented reality through the browser
 */
export const ARViewer: React.FC<ARViewerProps> = ({
  modelPath,
  itemName,
  onClose,
  open,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const arSceneRef = useRef<HTMLDivElement>(null);

  // Check if device supports AR
  const isMobile =
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const createARScene = useCallback(() => {
    if (!arSceneRef.current) return;

    const sceneHTML = `
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="antialias: true; alpha: true; precision: mediump;"
        embedded
        loading-screen="enabled: false"
      >
        <a-assets>
          <a-asset-item id="model" src="${modelPath}" response-type="arraybuffer" crossorigin="anonymous"></a-asset-item>
        </a-assets>

        <a-entity light="type: ambient; intensity: 0.5;"></a-entity>
        <a-entity light="type: directional; intensity: 0.7; castShadow: true;" position="-1 1 2"></a-entity>

        <a-marker preset="hiro" smooth="true" smoothCount="10" smoothTolerance="0.01" raycaster="objects: .clickable" emitevents="true">
          <a-entity
            id="model-entity"
            gltf-model="#model"
            scale="0.5 0.5 0.5"
            position="0 0 0"
            rotation="0 0 0"
            animation-mixer="clip: *; loop: repeat"
            shadow="cast: true; receive: true"
            class="clickable"
          ></a-entity>
          
          <a-plane 
            position="0 -0.5 0" 
            rotation="-90 0 0" 
            width="1" 
            height="1" 
            shadow="receive: true"
            material="transparent: true; opacity: 0.5"
          ></a-plane>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>
    `;

    arSceneRef.current.innerHTML = sceneHTML;

    // Add event listeners for model loading
    const modelEntity = arSceneRef.current.querySelector('#model-entity');
    if (modelEntity) {
      modelEntity.addEventListener('model-loaded', () => {
        console.log('Model loaded successfully');
        setIsLoading(false);
      });

      modelEntity.addEventListener('model-error', (error: any) => {
        console.error('Error loading model:', error);
        setError('Failed to load 3D model. Please try again.');
        setIsLoading(false);
      });
    }

    // Add marker detection events
    const marker = arSceneRef.current.querySelector('a-marker');
    if (marker) {
      marker.addEventListener('markerFound', () => {
        console.log('Marker detected');
        setShowInstructions(false);
      });

      marker.addEventListener('markerLost', () => {
        console.log('Marker lost');
      });
    }
  }, [modelPath]);

  useEffect(() => {
    if (!open) return;

    let timeoutId: NodeJS.Timeout;
    // Store ref in a variable to use in cleanup
    const currentRef = arSceneRef.current;

    const loadARScene = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamically import A-Frame to avoid SSR issues
        if (typeof window !== "undefined") {
          await import("aframe");
          await import("ar.js/aframe/build/aframe-ar");

          // Create AR scene
          createARScene();

          // Hide loading after scene is ready
          timeoutId = setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        }
      } catch (err) {
        console.error("Error loading AR scene:", err);
        setError("Failed to load AR experience. Please try again.");
        setIsLoading(false);
      }
    };

    loadARScene();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      // Use stored ref in cleanup
      if (currentRef) {
        currentRef.innerHTML = "";
      }
    };
  }, [open, modelPath, createARScene]);

  const handleFullscreen = () => {
    if (arSceneRef.current) {
      if (arSceneRef.current.requestFullscreen) {
        arSceneRef.current.requestFullscreen();
      }
    }
  };

  const renderInstructions = () => (
    <Alert
      severity="info"
      sx={{ mb: 2 }}
      action={
        <IconButton
          color="inherit"
          size="small"
          onClick={() => setShowInstructions(false)}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      <Typography variant="body2" component="div">
        <strong>AR Instructions:</strong>
        <br />
        {isMobile ? (
          <>
            1. Allow camera access when prompted
            <br />
            2. Point your camera at a flat surface
            <br />
            3. Look for the AR marker or tap to place the model
            <br />
            4. Move around to view the {itemName} from different angles
          </>
        ) : (
          <>
            1. Allow camera access when prompted
            <br />
            2. Print or display the Hiro marker on your screen
            <br />
            3. Point your camera at the marker
            <br />
            4. The {itemName} model will appear on the marker
          </>
        )}
      </Typography>
    </Alert>
  );

  const renderError = () => (
    <Alert severity="error" sx={{ mb: 2 }}>
      <Typography variant="body2">
        {error}
        <br />
        <strong>Troubleshooting:</strong>
        <br />
        • Ensure camera permissions are granted
        <br />
        • Try refreshing the page
        <br />• Use a mobile device for better AR experience
      </Typography>
    </Alert>
  );

  const renderLoading = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="300px"
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Loading AR Experience...
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Please allow camera access when prompted
        <br />
        This may take a few moments
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          height: isMobile ? "100vh" : "80vh",
          maxHeight: isMobile ? "100vh" : "80vh",
        },
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
        <Typography variant="h6">AR View: {itemName}</Typography>
        <Box>
          <IconButton onClick={() => setShowInstructions(!showInstructions)}>
            <HelpIcon />
          </IconButton>
          <IconButton onClick={handleFullscreen}>
            <FullscreenIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2, height: "100%", overflow: "hidden" }}>
        {showInstructions && renderInstructions()}
        {error && renderError()}

        {isLoading ? (
          renderLoading()
        ) : (
          <Box
            ref={arSceneRef}
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "400px",
              backgroundColor: "#000",
              borderRadius: 1,
              overflow: "hidden",
              position: "relative",
            }}
          />
        )}
      </DialogContent>

      {!isLoading && (
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Close AR View
          </Button>
          <Button
            onClick={() =>
              window.open("https://ar-js.org/images/hiro.png", "_blank")
            }
            variant="text"
            size="small"
          >
            Download AR Marker
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

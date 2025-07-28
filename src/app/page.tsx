"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  AppBar,
  Toolbar,
  Fab,
  Paper,
  Stack,
  Chip,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  QrCodeScanner as QrCodeScannerIcon,
  ViewInAr as ViewInArIcon,
  Login as LoginIcon,
  Dashboard as DashboardIcon,
  Smartphone as SmartphoneIcon,
  Computer as ComputerIcon,
  Public as PublicIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView as useInViewObserver } from "react-intersection-observer";
import { mockRestaurants } from "@/lib/database";
import homeData from "@/data/home_mock.json";

/**
 * Enhanced Landing Page with Professional Animations and Scroll Effects
 * Features smooth animations, parallax effects, and scroll-triggered animations
 */
export default function HomePage() {
  const router = useRouter();
  const [qrInput, setQrInput] = useState("");
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Animation variants with proper TypeScript types
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
    },
    hover: {
      y: -10,
      scale: 1.02,
      rotateX: 5,
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    },
  };

  // Custom hook for scroll-triggered animations
  const AnimatedSection: React.FC<{
    children: React.ReactNode;
    delay?: number;
  }> = ({ children, delay = 0 }) => {
    const [ref, inView] = useInViewObserver({
      threshold: 0.1,
      triggerOnce: true,
    });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              delay,
              ease: "easeOut",
            },
          },
        }}
      >
        {children}
      </motion.div>
    );
  };

  // Helper function to get icon component based on string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      qr: (
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <QrCodeScannerIcon
            sx={{ fontSize: "3rem", color: "primary.main", mb: 2 }}
          />
        </motion.div>
      ),
      ar: (
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <ViewInArIcon
            sx={{ fontSize: "3rem", color: "success.main", mb: 2 }}
          />
        </motion.div>
      ),
      restaurant: (
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <RestaurantIcon
            sx={{ fontSize: "3rem", color: "warning.main", mb: 2 }}
          />
        </motion.div>
      ),
      smartphone: (
        <SmartphoneIcon sx={{ fontSize: "2rem", color: "primary.main" }} />
      ),
      computer: (
        <ComputerIcon sx={{ fontSize: "2rem", color: "primary.main" }} />
      ),
      web: <PublicIcon sx={{ fontSize: "2rem", color: "primary.main" }} />,
      login: <LoginIcon />,
      dashboard: <DashboardIcon />,
    };
    return iconMap[iconName] || <RestaurantIcon />;
  };

  const handleQrSubmit = () => {
    if (qrInput.trim()) {
      const restaurant = mockRestaurants.find(
        (r) =>
          r.qrCodeSecret === qrInput.trim() ||
          r.customDomain === qrInput.trim().toLowerCase()
      );

      if (restaurant) {
        router.push(
          `/menu/${restaurant.customDomain}?r=${restaurant.qrCodeSecret}`
        );
      } else {
        alert("Restaurant not found. Please check your QR code or link.");
      }
    }
  };

  return (
    <>
      {/* Animated Background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
          background: `
            radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(240, 147, 251, 0.08) 0%, transparent 50%)
          `,
        }}
      />

      <Box sx={{ flexGrow: 1, minHeight: "100vh", position: "relative" }}>
        {/* Enhanced App Bar */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <AppBar
            position="sticky"
            sx={{
              background: "rgba(102, 126, 234, 0.9)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Toolbar>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <RestaurantIcon sx={{ mr: 2, fontSize: "2rem" }} />
              </motion.div>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                {homeData.appBar.title}
              </Typography>
              {homeData.appBar.buttons.map((button, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    color="inherit"
                    startIcon={getIconComponent(button.icon)}
                    onClick={() => router.push(button.route)}
                    sx={{
                      mr: index === 0 ? 1 : 0,
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    {button.label}
                  </Button>
                </motion.div>
              ))}
            </Toolbar>
          </AppBar>
        </motion.div>

        <Container maxWidth="xl" sx={{ py: 6 }}>
          {/* Enhanced Hero Section */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <AnimatedSection>
              <Box textAlign="center" mb={8}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="h2"
                      component="h1"
                      gutterBottom
                      sx={{
                        fontWeight: 800,
                        background:
                          "linear-gradient(45deg, #667eea 30%, #764ba2 70%, #f093fb 100%)",
                        backgroundSize: "200% 200%",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "shimmer 3s ease-in-out infinite",
                        "@keyframes shimmer": {
                          "0%": { backgroundPosition: "0% 50%" },
                          "50%": { backgroundPosition: "100% 50%" },
                          "100%": { backgroundPosition: "0% 50%" },
                        },
                      }}
                    >
                      {homeData.hero.title}
                    </Typography>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="h5"
                      color="text.secondary"
                      paragraph
                      sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
                    >
                      {homeData.hero.subtitle}
                    </Typography>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        maxWidth: 500,
                        mx: "auto",
                        mb: 4,
                        borderRadius: 4,
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {homeData.hero.qrAccess.title}
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          fullWidth
                          placeholder={homeData.hero.qrAccess.placeholder}
                          value={qrInput}
                          onChange={(e) => setQrInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleQrSubmit()
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <QrCodeScannerIcon color="action" />
                              </InputAdornment>
                            ),
                            sx: {
                              borderRadius: 2,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(255, 255, 255, 0.3)",
                              },
                            },
                          }}
                        />
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            onClick={handleQrSubmit}
                            sx={{
                              minWidth: 120,
                              borderRadius: 2,
                              background:
                                "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                              "&:hover": {
                                boxShadow:
                                  "0 6px 20px rgba(102, 126, 234, 0.6)",
                              },
                            }}
                          >
                            {homeData.hero.qrAccess.buttonText}
                          </Button>
                        </motion.div>
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {homeData.hero.qrAccess.helpText}
                      </Typography>
                    </Paper>
                  </motion.div>
                </motion.div>
              </Box>
            </AnimatedSection>
          </motion.div>

          {/* Enhanced Featured Restaurants */}
          <AnimatedSection delay={0.2}>
            <Box mb={8}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  textAlign="center"
                  sx={{ fontWeight: 700, mb: 4 }}
                >
                  {homeData.featuredSection.title}
                </Typography>
              </motion.div>

              <Grid container spacing={4}>
                {mockRestaurants
                  .filter((r) => r.isActive)
                  .map((restaurant, index) => (
                    <Grid item xs={12} md={6} key={restaurant.id}>
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        whileHover="hover"
                        variants={cardVariants}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            borderRadius: 4,
                            overflow: "hidden",
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            position: "relative",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "3px",
                              background: restaurant.theme
                                ? `linear-gradient(45deg, ${restaurant.theme.primaryColor} 30%, ${restaurant.theme.secondaryColor} 90%)`
                                : "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 4 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                <RestaurantIcon
                                  sx={{
                                    fontSize: "2.5rem",
                                    color:
                                      restaurant.theme?.primaryColor ||
                                      "primary.main",
                                    mr: 2,
                                  }}
                                />
                              </motion.div>
                              <Box>
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: 700 }}
                                >
                                  {restaurant.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {restaurant.description}
                                </Typography>
                              </Box>
                            </Box>

                            <Typography variant="body2" paragraph>
                              📍 {restaurant.address}
                            </Typography>

                            <Stack direction="row" spacing={1} mb={3}>
                              <motion.div whileHover={{ scale: 1.05 }}>
                                <Chip
                                  label={restaurant.subscriptionPlan?.toUpperCase()}
                                  color="primary"
                                  size="small"
                                />
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }}>
                                <Chip
                                  label="AR Available"
                                  color="success"
                                  size="small"
                                  icon={<ViewInArIcon />}
                                />
                              </motion.div>
                            </Stack>

                            <Alert severity="info" sx={{ mb: 2 }}>
                              <Typography variant="caption">
                                <strong>QR Code:</strong>{" "}
                                {restaurant.qrCodeSecret}
                              </Typography>
                            </Alert>
                          </CardContent>

                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <motion.div
                              style={{ width: "100%" }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<QrCodeScannerIcon />}
                                onClick={() =>
                                  router.push(
                                    `/menu/${restaurant.customDomain}?r=${restaurant.qrCodeSecret}`
                                  )
                                }
                                sx={{
                                  borderRadius: 3,
                                  background: restaurant.theme
                                    ? `linear-gradient(45deg, ${restaurant.theme.primaryColor} 30%, ${restaurant.theme.secondaryColor} 90%)`
                                    : "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                                  "&:hover": {
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                                  },
                                }}
                              >
                                View Menu
                              </Button>
                            </motion.div>
                          </CardActions>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </AnimatedSection>

          {/* Enhanced Platform Features */}
          <AnimatedSection delay={0.4}>
            <Box mb={8}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  textAlign="center"
                  sx={{ fontWeight: 700, mb: 4 }}
                >
                  {homeData.platformFeatures.title}
                </Typography>
              </motion.div>

              <Grid container spacing={4}>
                {homeData.platformFeatures.features.map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      whileHover="hover"
                      variants={cardVariants}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          height: "100%",
                          borderRadius: 4,
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        {getIconComponent(feature.icon)}
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </AnimatedSection>

          {/* Enhanced Device Compatibility */}
          <AnimatedSection delay={0.6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={cardVariants}
              viewport={{ once: true }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  {homeData.deviceCompatibility.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {homeData.deviceCompatibility.subtitle}
                </Typography>
                <Stack
                  direction="row"
                  spacing={4}
                  justifyContent="center"
                  alignItems="center"
                >
                  {homeData.deviceCompatibility.devices.map((device, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Box textAlign="center">
                        {getIconComponent(device.icon)}
                        <Typography variant="caption" display="block">
                          {device.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </Paper>
            </motion.div>
          </AnimatedSection>
        </Container>

        {/* Enhanced Floating Action Button */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Fab
            color="primary"
            aria-label={homeData.floatingAction.tooltip}
            sx={{
              background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
              boxShadow: "0 8px 25px rgba(255, 107, 107, 0.4)",
              "&:hover": {
                boxShadow: "0 12px 35px rgba(255, 107, 107, 0.6)",
              },
            }}
            onClick={() => router.push(homeData.floatingAction.route)}
          >
            {homeData.floatingAction.text}
          </Fab>
        </motion.div>
      </Box>
    </>
  );
}

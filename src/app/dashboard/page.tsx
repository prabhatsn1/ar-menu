/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  ListItemIcon,
} from "@mui/material";
import {
  Add as AddIcon,
  Restaurant as RestaurantIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useInView as useInViewObserver } from "react-intersection-observer";
import { MenuItem as MenuItemType, MenuCategory, Restaurant } from "@/types";
import {
  getRestaurantsByOwner,
  getMenuItemsByRestaurant,
  getCategoriesByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/database";
import dashboardData from "@/data/dashboard_mock.json";

/**
 * Enhanced Restaurant Owner Dashboard with Professional Animations
 * Features smooth animations, scroll effects, and interactive transitions
 */
export default function DashboardPage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const userId = "owner-1"; // In a real app, get user from session

  // Parallax effects
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // State management
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  // Form state for new/edit item
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    model3D: "",
    allergens: "",
    isVegetarian: false,
    isVegan: false,
    spicyLevel: 0,
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const userRestaurants = await getRestaurantsByOwner(userId);

      if (userRestaurants.length > 0) {
        const restaurant = userRestaurants[0];
        setSelectedRestaurant(restaurant);
        await loadRestaurantData(restaurant.id);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const loadRestaurantData = async (restaurantId: string) => {
    try {
      const [items, cats] = await Promise.all([
        getMenuItemsByRestaurant(restaurantId),
        getCategoriesByRestaurant(restaurantId),
      ]);
      setMenuItems(items);
      setCategories(cats);
    } catch (error) {
      console.error("Error loading restaurant data:", error);
    }
  };

  const handleItemSubmit = async () => {
    if (!selectedRestaurant) return;

    try {
      const itemData = {
        ...itemForm,
        price: parseFloat(itemForm.price),
        allergens: itemForm.allergens
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        restaurantId: selectedRestaurant.id,
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, selectedRestaurant.id, itemData);
      } else {
        await createMenuItem(itemData);
      }

      // Reload menu items
      await loadRestaurantData(selectedRestaurant.id);

      // Reset form and close dialog
      setItemDialogOpen(false);
      setEditingItem(null);
      resetItemForm();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedRestaurant) return;

    try {
      await deleteMenuItem(itemId, selectedRestaurant.id);
      await loadRestaurantData(selectedRestaurant.id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const openEditDialog = (item: MenuItemType) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      model3D: item.model3D || "",
      allergens: item.allergens?.join(", ") || "",
      isVegetarian: item.isVegetarian || false,
      isVegan: item.isVegan || false,
      spicyLevel: item.spicyLevel || 0,
    });
    setItemDialogOpen(true);
  };

  const resetItemForm = () => {
    setItemForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      model3D: "",
      allergens: "",
      isVegetarian: false,
      isVegan: false,
      spicyLevel: 0,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Helper function to get icon component based on string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      person: <PersonIcon />,
      settings: <EditIcon />,
      logout: <LogoutIcon />,
      restaurant: <RestaurantIcon />,
      category: <EditIcon />,
      ar: <ViewIcon />,
      visibility: <ViewIcon />,
      add: <AddIcon />,
      edit: <EditIcon />,
      delete: <DeleteIcon />,
    };
    return iconMap[iconName] || <RestaurantIcon />;
  };

  // Animation variants
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
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      rotateX: 2,
      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 20,
      },
    },
  };

  const statsVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateY: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
      },
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      boxShadow: "0 15px 30px rgba(102, 126, 234, 0.2)",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      },
    },
  };

  // Custom animated section component
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <RestaurantIcon sx={{ fontSize: "4rem", color: "white", mb: 2 }} />
          </motion.div>
          <Typography variant="h6" sx={{ color: "white", ml: 2 }}>
            Loading dashboard...
          </Typography>
        </Box>
      </motion.div>
    );
  }

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
            radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(240, 147, 251, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        {/* Enhanced App Bar */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <AppBar
            position="sticky"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
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
                {dashboardData.appBar.title}
              </Typography>

              {selectedRestaurant && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <Chip
                    label={selectedRestaurant.name}
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      mr: 2,
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  color="inherit"
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background: "rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </motion.div>
            </Toolbar>
          </AppBar>
        </motion.div>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Enhanced Welcome Section */}
          <AnimatedSection>
            <Box mb={4}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: 800,
                      background:
                        "linear-gradient(45deg, #667eea 30%, #764ba2 70%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {dashboardData.welcome.title}
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography variant="body1" color="text.secondary">
                    {dashboardData.welcome.subtitle}
                  </Typography>
                </motion.div>
              </motion.div>
            </Box>
          </AnimatedSection>

          {/* Enhanced Quick Stats */}
          <AnimatedSection delay={0.2}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={3} mb={4}>
                {dashboardData.quickStats.stats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                      variants={statsVariants}
                      whileHover="hover"
                      custom={index}
                    >
                      <Card
                        sx={{
                          borderRadius: 4,
                          background: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "3px",
                            background: `linear-gradient(45deg, ${
                              index === 0
                                ? "#FF6B6B, #4ECDC4"
                                : index === 1
                                ? "#667eea, #764ba2"
                                : index === 2
                                ? "#f093fb, #f5576c"
                                : "#4facfe, #00f2fe"
                            })`,
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.3,
                            }}
                          >
                            <Typography
                              color="textSecondary"
                              gutterBottom
                              sx={{ fontWeight: 600 }}
                            >
                              {stat.label}
                            </Typography>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.5 + index * 0.1,
                              type: "spring",
                              stiffness: 200,
                            }}
                          >
                            <Typography
                              variant="h4"
                              component="h2"
                              sx={{
                                fontWeight: 700,
                                background: `linear-gradient(45deg, ${
                                  index === 0
                                    ? "#FF6B6B, #4ECDC4"
                                    : index === 1
                                    ? "#667eea, #764ba2"
                                    : index === 2
                                    ? "#f093fb, #f5576c"
                                    : "#4facfe, #00f2fe"
                                })`,
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              {stat.value === "menuItems.length"
                                ? menuItems.length
                                : stat.value === "categories.length"
                                ? categories.length
                                : stat.value === "arModelsCount"
                                ? menuItems.filter((item) => item.model3D)
                                    .length
                                : stat.value === "activeItemsCount"
                                ? menuItems.filter((item) => item.isActive)
                                    .length
                                : stat.value}
                            </Typography>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </AnimatedSection>

          {/* Enhanced Menu Items Grid */}
          <AnimatedSection delay={0.4}>
            <Card
              sx={{
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{ fontWeight: 700 }}
                    >
                      {dashboardData.menuManagement.title}
                    </Typography>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={getIconComponent(
                          dashboardData.menuManagement.addButton.icon
                        )}
                        onClick={() => {
                          resetItemForm();
                          setEditingItem(null);
                          setItemDialogOpen(true);
                        }}
                        sx={{
                          borderRadius: 3,
                          background:
                            "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                          "&:hover": {
                            boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                          },
                        }}
                      >
                        {dashboardData.menuManagement.addButton.text}
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>

                <AnimatePresence>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Grid container spacing={3}>
                      {menuItems.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            transition={{ delay: index * 0.1 }}
                            layout
                          >
                            <Card
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 3,
                                overflow: "hidden",
                                background: "rgba(255, 255, 255, 0.95)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                              }}
                            >
                              <Box
                                sx={{
                                  height: 200,
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={500}
                                    height={200}
                                    style={{ objectFit: "cover" }}
                                    priority
                                  />
                                </motion.div>
                              </Box>
                              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{ fontWeight: 600 }}
                                >
                                  {item.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  paragraph
                                  sx={{ lineHeight: 1.6 }}
                                >
                                  {item.description}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  color="primary"
                                  sx={{ fontWeight: 700 }}
                                >
                                  {formatPrice(item.price)}
                                </Typography>
                                <Box mt={2}>
                                  <AnimatePresence>
                                    {item.isVegetarian && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        style={{ display: "inline-block" }}
                                      >
                                        <Chip
                                          label="Vegetarian"
                                          size="small"
                                          color="success"
                                          sx={{ mr: 1 }}
                                        />
                                      </motion.div>
                                    )}
                                    {item.model3D && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        style={{ display: "inline-block" }}
                                      >
                                        <Chip
                                          label="AR Available"
                                          size="small"
                                          color="info"
                                        />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </Box>
                              </CardContent>
                              <CardActions sx={{ p: 2 }}>
                                {dashboardData.menuManagement.itemActions.map(
                                  (action, actionIndex) => (
                                    <motion.div
                                      key={actionIndex}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Button
                                        size="small"
                                        startIcon={getIconComponent(
                                          action.icon
                                        )}
                                        color={action.color as any}
                                        onClick={() => {
                                          if (action.label === "View") {
                                            router.push(
                                              `/item/${item.id}?r=${selectedRestaurant?.qrCodeSecret}`
                                            );
                                          } else if (action.label === "Edit") {
                                            openEditDialog(item);
                                          } else if (
                                            action.label === "Delete"
                                          ) {
                                            handleDeleteItem(item.id);
                                          }
                                        }}
                                        sx={{
                                          borderRadius: 2,
                                          "&:hover": {
                                            backgroundColor: `${action.color}.50`,
                                          },
                                        }}
                                      >
                                        {action.label}
                                      </Button>
                                    </motion.div>
                                  )
                                )}
                              </CardActions>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                </AnimatePresence>

                {menuItems.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Box textAlign="center" py={8}>
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <RestaurantIcon
                          sx={{
                            fontSize: "4rem",
                            color: "primary.main",
                            mb: 2,
                          }}
                        />
                      </motion.div>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {dashboardData.menuManagement.emptyState.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={3}>
                        {dashboardData.menuManagement.emptyState.subtitle}
                      </Typography>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => setItemDialogOpen(true)}
                          sx={{
                            borderRadius: 3,
                            background:
                              "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                          }}
                        >
                          {dashboardData.menuManagement.emptyState.buttonText}
                        </Button>
                      </motion.div>
                    </Box>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>
        </Container>

        {/* Enhanced Add/Edit Item Dialog */}
        <AnimatePresence>
          {itemDialogOpen && (
            <Dialog
              open={itemDialogOpen}
              onClose={() => setItemDialogOpen(false)}
              maxWidth="md"
              fullWidth
              PaperProps={
                {
                  component: motion.div,
                  initial: { opacity: 0, scale: 0.8, y: -50 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.8, y: -50 },
                  transition: { type: "spring", stiffness: 300, damping: 30 },
                  style: {
                    borderRadius: 16,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                  },
                } as any
              }
            >
              <DialogTitle sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
                {editingItem
                  ? dashboardData.itemDialog.editTitle
                  : dashboardData.itemDialog.addTitle}
              </DialogTitle>
              <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Grid container spacing={2}>
                      {dashboardData.itemDialog.fields.map((field, index) => (
                        <Grid
                          item
                          xs={field.grid.xs}
                          sm={field.grid.sm}
                          key={index}
                        >
                          <motion.div variants={itemVariants}>
                            {field.type === "text" ||
                            field.type === "number" ? (
                              <TextField
                                fullWidth
                                label={field.label}
                                type={field.type}
                                required={field.required}
                                value={
                                  itemForm[
                                    field.name as keyof typeof itemForm
                                  ] || (field.type === "number" ? 0 : "")
                                }
                                onChange={(e) =>
                                  setItemForm({
                                    ...itemForm,
                                    [field.name]: e.target.value,
                                  })
                                }
                                inputProps={
                                  field.type === "number"
                                    ? { step: "0.01" }
                                    : {}
                                }
                              />
                            ) : field.type === "textarea" ? (
                              <TextField
                                fullWidth
                                label={field.label}
                                multiline
                                rows={field.rows}
                                required={field.required}
                                value={
                                  itemForm[field.name as keyof typeof itemForm]
                                }
                                onChange={(e) =>
                                  setItemForm({
                                    ...itemForm,
                                    [field.name]: e.target.value,
                                  })
                                }
                              />
                            ) : field.type === "select" ? (
                              <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                  value={
                                    itemForm[
                                      field.name as keyof typeof itemForm
                                    ]
                                  }
                                  onChange={(e) =>
                                    setItemForm({
                                      ...itemForm,
                                      [field.name]: e.target.value,
                                    })
                                  }
                                >
                                  {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                      {cat.icon} {cat.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : field.type === "switch" ? (
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      itemForm[
                                        field.name as keyof typeof itemForm
                                      ]
                                    )}
                                    onChange={(e) =>
                                      setItemForm({
                                        ...itemForm,
                                        [field.name]: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label={field.label}
                              />
                            ) : null}
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setItemDialogOpen(false)}
                    sx={{ borderRadius: 2 }}
                  >
                    {dashboardData.itemDialog.buttons.cancel}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleItemSubmit}
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      background:
                        "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    }}
                  >
                    {editingItem
                      ? dashboardData.itemDialog.buttons.update
                      : dashboardData.itemDialog.buttons.create}
                  </Button>
                </motion.div>
              </DialogActions>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Enhanced User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              mt: 1,
            },
          }}
        >
          {dashboardData.appBar.userMenu.items.map((menuItem, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MenuItem
                onClick={() => router.push(menuItem.route)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  "&:hover": {
                    background: "rgba(102, 126, 234, 0.1)",
                  },
                }}
              >
                <ListItemIcon>{getIconComponent(menuItem.icon)}</ListItemIcon>
                {menuItem.label}
              </MenuItem>
            </motion.div>
          ))}
        </Menu>
      </Box>
    </>
  );
}

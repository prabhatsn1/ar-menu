"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Stack,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ViewInAr as ViewInArIcon,
  QrCode as QrCodeIcon,
  Search as SearchIcon,
  Restaurant as RestaurantIcon,
  CameraAlt as CameraIcon,
  PhoneAndroid as PhoneIcon,
  Wifi as WifiIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
  Share as ShareIcon,
  TouchApp as TouchAppIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import guideData from "@/data/guide_mock.json";

/**
 * Comprehensive Guide Page for AR Restaurant Menu
 * Provides detailed instructions on how to use all features of the application
 */
export default function GuidePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Helper function to get icon component based on string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      search: <SearchIcon color="primary" />,
      ar: <ViewInArIcon color="primary" />,
      qr: <QrCodeIcon color="primary" />,
      settings: <InfoIcon color="primary" />,
      phone: <PhoneIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />,
      camera: <CameraIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />,
      wifi: <WifiIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />,
      security: <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />,
      restaurant: <RestaurantIcon color="primary" />,
      share: <ShareIcon color="primary" />,
      speed: <SpeedIcon color="primary" />,
      language: <LanguageIcon color="primary" />,
      check: <CheckCircleIcon color="success" />,
      touch: <TouchAppIcon color="primary" />,
    };
    return iconMap[iconName] || <InfoIcon color="primary" />;
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => router.back()}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <RestaurantIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
            {guideData.header.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {guideData.header.subtitle}
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              {guideData.header.description}
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>{guideData.header.proTip}</strong>
            </Typography>
          </Alert>
        </Paper>

        {/* Quick Start Guide */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            🚀 Quick Start Guide
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {guideData.quickStartSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body1" paragraph>
                    {step.content}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={index === guideData.quickStartSteps.length - 1}
                    >
                      {index === guideData.quickStartSteps.length - 1
                        ? "Finish"
                        : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === guideData.quickStartSteps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {guideData.completionMessage.title}
              </Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Start Over
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push("/")}
                sx={{ mt: 1 }}
              >
                {guideData.completionMessage.buttonText}
              </Button>
            </Paper>
          )}
        </Paper>

        {/* Detailed Instructions */}
        <Box mb={4}>
          {/* Section 1: Browsing the Menu */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <SearchIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {guideData.sections.browsing.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <Card elevation={1} sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {guideData.sections.browsing.searchFeatures.title}
                      </Typography>
                      <List dense>
                        {guideData.sections.browsing.searchFeatures.features.map(
                          (feature, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" />
                              </ListItemIcon>
                              <ListItemText
                                primary={feature.title}
                                secondary={feature.description}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </CardContent>
                  </Card>
                  <Card elevation={1} sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {guideData.sections.browsing.categoryFiltering.title}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                        {guideData.sections.browsing.categoryFiltering.categories.map(
                          (category, index) => (
                            <Chip
                              key={index}
                              label={category.label}
                              size="small"
                            />
                          )
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {
                          guideData.sections.browsing.categoryFiltering
                            .description
                        }
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>

                <Alert severity="success" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>
                      {guideData.sections.browsing.searchTips.title}
                    </strong>
                    {guideData.sections.browsing.searchTips.tips.map(
                      (tip, index) => (
                        <React.Fragment key={index}>
                          <br />• {tip}
                        </React.Fragment>
                      )
                    )}
                  </Typography>
                </Alert>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Section 2: AR Features */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ViewInArIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {guideData.sections.arFeatures.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>
                    {guideData.sections.arFeatures.deviceRequirement}
                  </strong>
                </Typography>
              </Alert>

              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <Card elevation={1} sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {guideData.sections.arFeatures.howToUse.title}
                      </Typography>
                      <List dense>
                        {guideData.sections.arFeatures.howToUse.steps.map(
                          (step, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Typography variant="h6">
                                  {step.number}
                                </Typography>
                              </ListItemIcon>
                              <ListItemText
                                primary={step.title}
                                secondary={step.description}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </CardContent>
                  </Card>
                  <Card elevation={1} sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {guideData.sections.arFeatures.arControls.title}
                      </Typography>
                      <List dense>
                        {guideData.sections.arFeatures.arControls.controls.map(
                          (control, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <TouchAppIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={control.action}
                                secondary={control.description}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Stack>

                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    {guideData.sections.arFeatures.systemRequirements.title}
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    divider={
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ borderColor: "divider.main" }}
                      />
                    }
                  >
                    {guideData.sections.arFeatures.systemRequirements.requirements.map(
                      (req, index) => (
                        <Card key={index} variant="outlined" sx={{ flex: 1 }}>
                          <CardContent sx={{ textAlign: "center" }}>
                            {getIconComponent(req.icon)}
                            <Typography variant="subtitle2">
                              {req.type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {req.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Section 3: QR Code Features */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <QrCodeIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {guideData.sections.qrCodes.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <Card elevation={1} sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {guideData.sections.qrCodes.individualItems.title}
                      </Typography>
                      <List dense>
                        {guideData.sections.qrCodes.individualItems.features.map(
                          (feature, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                {getIconComponent(feature.icon)}
                              </ListItemIcon>
                              <ListItemText
                                primary={feature.title}
                                secondary={feature.description}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </CardContent>
                  </Card>
                  <Card elevation={1} sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {guideData.sections.qrCodes.completeMenu.title}
                      </Typography>
                      <List dense>
                        {guideData.sections.qrCodes.completeMenu.features.map(
                          (feature, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                {getIconComponent(feature.icon)}
                              </ListItemIcon>
                              <ListItemText
                                primary={feature.title}
                                secondary={feature.description}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Stack>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>{guideData.sections.qrCodes.useCases.title}</strong>
                    {guideData.sections.qrCodes.useCases.cases.map(
                      (useCase, index) => (
                        <React.Fragment key={index}>
                          <br />• {useCase}
                        </React.Fragment>
                      )
                    )}
                  </Typography>
                </Alert>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Section 4: Advanced Features */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <InfoIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {guideData.sections.advancedFeatures.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <Card elevation={1} sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {
                          guideData.sections.advancedFeatures.languageSettings
                            .title
                        }
                      </Typography>
                      <List dense>
                        {guideData.sections.advancedFeatures.languageSettings.features.map(
                          (feature, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                {getIconComponent(feature.icon)}
                              </ListItemIcon>
                              <ListItemText
                                primary={feature.title}
                                secondary={feature.description}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </CardContent>
                  </Card>
                  <Card elevation={1} sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {guideData.sections.advancedFeatures.dietaryInfo.title}
                      </Typography>
                      <Stack direction="row" spacing={1} mb={2}>
                        {guideData.sections.advancedFeatures.dietaryInfo.badges.map(
                          (badge, index) => (
                            <Chip
                              key={index}
                              label={badge.label}
                              color={
                                badge.color as "success" | "info" | "warning"
                              }
                              size="small"
                            />
                          )
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {
                          guideData.sections.advancedFeatures.dietaryInfo
                            .description
                        }
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>

                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    {guideData.sections.advancedFeatures.troubleshooting.title}
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Alert severity="warning" sx={{ mb: 2, flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {
                          guideData.sections.advancedFeatures.troubleshooting
                            .arIssues.title
                        }
                      </Typography>
                      <Typography variant="body2">
                        {guideData.sections.advancedFeatures.troubleshooting.arIssues.solutions.map(
                          (solution, index) => (
                            <React.Fragment key={index}>
                              • {solution}
                              {index <
                                guideData.sections.advancedFeatures
                                  .troubleshooting.arIssues.solutions.length -
                                  1 && <br />}
                            </React.Fragment>
                          )
                        )}
                      </Typography>
                    </Alert>
                    <Alert severity="info" sx={{ mb: 2, flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {
                          guideData.sections.advancedFeatures.troubleshooting
                            .qrIssues.title
                        }
                      </Typography>
                      <Typography variant="body2">
                        {guideData.sections.advancedFeatures.troubleshooting.qrIssues.solutions.map(
                          (solution, index) => (
                            <React.Fragment key={index}>
                              • {solution}
                              {index <
                                guideData.sections.advancedFeatures
                                  .troubleshooting.qrIssues.solutions.length -
                                  1 && <br />}
                            </React.Fragment>
                          )
                        )}
                      </Typography>
                    </Alert>
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Call to Action */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {guideData.callToAction.title}
          </Typography>
          <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
            {guideData.callToAction.description}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/")}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            {guideData.callToAction.buttonText}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

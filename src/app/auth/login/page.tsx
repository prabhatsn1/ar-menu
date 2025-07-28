"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  Link,
  Divider,
  Stack,
  Paper,
  Grid,
  Chip,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { authenticateUser, setCurrentUser } from "@/lib/auth";
import authData from "@/data/auth_mock.json";

/**
 * Enhanced Login Page for Restaurant Owners
 * Authenticates restaurant owners using mock JSON data
 */
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Helper function to get icon component based on string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      restaurant: (
        <RestaurantIcon
          sx={{ fontSize: "3rem", color: "primary.main", mb: 2 }}
        />
      ),
      email: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />,
      lock: <LockIcon sx={{ mr: 1, color: "text.secondary" }} />,
      login: <LoginIcon />,
      ar: <RestaurantIcon />,
      qr: <RestaurantIcon />,
      analytics: <RestaurantIcon />,
      mobile: <RestaurantIcon />,
    };
    return iconMap[iconName] || <RestaurantIcon />;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await authenticateUser(email, password);
      setCurrentUser(user);
      router.push("/dashboard");
    } catch {
      setError(authData.messages.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            {getIconComponent(authData.header.logo.icon)}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {authData.header.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {authData.header.subtitle}
            </Typography>
          </Box>

          {/* Demo Accounts */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: "#f8f9fa",
              border: "1px solid #e9ecef",
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {authData.demoAccounts.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {authData.demoAccounts.subtitle}
            </Typography>

            {authData.demoAccounts.accounts.map((account, index) => (
              <Box
                key={index}
                mb={index < authData.demoAccounts.accounts.length - 1 ? 2 : 0}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {account.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {account.description}
                </Typography>
                <Stack direction="row" spacing={1} mb={1}>
                  {account.features.map((feature, featureIndex) => (
                    <Chip
                      key={featureIndex}
                      label={feature}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    handleDemoLogin(account.email, account.password)
                  }
                  sx={{ mt: 1 }}
                >
                  Use Demo Account
                </Button>
                {index < authData.demoAccounts.accounts.length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {authData.loginForm.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {authData.loginForm.subtitle}
            </Typography>

            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                {authData.loginForm.fields.map((field, index) => (
                  <TextField
                    key={index}
                    label={field.label}
                    type={field.type}
                    variant="outlined"
                    fullWidth
                    placeholder={field.placeholder}
                    value={field.name === "email" ? email : password}
                    onChange={(e) =>
                      field.name === "email"
                        ? setEmail(e.target.value)
                        : setPassword(e.target.value)
                    }
                    required={field.required}
                    autoComplete={field.autoComplete}
                    InputProps={{
                      startAdornment: getIconComponent(field.icon),
                    }}
                  />
                ))}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    background:
                      "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                    },
                  }}
                >
                  {loading
                    ? authData.loginForm.submitButton.loadingText
                    : authData.loginForm.submitButton.text}
                </Button>
              </Stack>
            </form>

            {/* Forgot Password Link */}
            <Box textAlign="center" mt={2}>
              <Link
                href={authData.loginForm.options.forgotPassword.link}
                underline="none"
                sx={{
                  color: "primary.main",
                  fontSize: "0.875rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {authData.loginForm.options.forgotPassword.text}
              </Link>
            </Box>
          </Box>

          {/* Platform Features */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {authData.features.title}
            </Typography>
            <Grid container spacing={2}>
              {authData.features.list.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <Box display="flex" alignItems="center" mb={1}>
                    {getIconComponent(feature.icon)}
                    <Box ml={1}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Sign Up Link */}
          <Box textAlign="center" mb={3}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {authData.signup.text}
            </Typography>
            <Link
              href={authData.signup.link}
              underline="none"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {authData.signup.linkText}
            </Link>
          </Box>

          {/* Footer Links */}
          <Box textAlign="center">
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
            >
              {authData.footer.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.route}
                  underline="none"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;

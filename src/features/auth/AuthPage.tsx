/**
 * ============================================================================
 * Authentication Page
 * ============================================================================
 *
 * Purpose
 * -------
 * Displays the application's authentication screen.
 *
 * Responsibilities
 * ----------------
 * - Display application branding.
 * - Display the authentication card.
 * - Allow users to switch between Login and Register modes.
 *
 * Learning Notes
 * --------------
 * This page is intentionally presentation-only.
 * Authentication logic will be implemented inside the individual forms.
 *
 * ============================================================================
 */

import { useState } from "react";

import { Box, Link, Paper, Stack, Typography } from "@mui/material";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

/**
 * ============================================================================
 * Authentication Page
 * ============================================================================
 */
const AuthPage = () => {
  /**
   * ------------------------------------------------------------------------
   * Authentication Mode
   * ------------------------------------------------------------------------
   */
  const [isLoginMode, setIsLoginMode] = useState(true);

  /**
   * ------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------
   */
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "grey.100",
      }}
    >
      {/* =================================================================
                Branding Section
            ================================================================= */}
      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          bgcolor: "primary.main",
          color: "common.white",
          p: 8,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
          }}
        >
          Tenant Management
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 4,
          }}
        >
          Modern Rental Management Platform
        </Typography>

        <Stack spacing={2}>
          <Typography>✓ Secure Authentication</Typography>

          <Typography>✓ Tenant Records</Typography>

          <Typography>✓ Rental Agreement Management</Typography>

          <Typography>✓ PDF Document Storage</Typography>
        </Stack>
      </Box>

      {/* =================================================================
                Authentication Card
            ================================================================= */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: 5,
            borderRadius: 3,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                }}
              >
                {isLoginMode ? "Welcome Back" : "Create Account"}
              </Typography>

              <Typography color="text.secondary">
                {isLoginMode
                  ? "Sign in to continue."
                  : "Create an account to continue."}
              </Typography>
            </Box>
            {isLoginMode ? (
              <LoginForm />
            ) : (
              <RegisterForm
                onRegistrationSuccess={() => setIsLoginMode(true)}
              />
            )}
            <Typography variant="body2" align="center">
              {isLoginMode
                ? "Don't have an account? "
                : "Already have an account? "}

              <Link
                component="button"
                type="button"
                underline="hover"
                onClick={() => setIsLoginMode((previous) => !previous)}
              >
                {isLoginMode ? "Register" : "Login"}
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthPage;

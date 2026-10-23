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

import { Avatar, Box, Link, Paper, Stack, Typography } from "@mui/material";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
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
          background: "linear-gradient(145deg, #102B46 0%, #163F62 62%, #1769AA 100%)",
          color: "common.white",
          p: 8,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: "center" }}>
          <Avatar variant="rounded" sx={{ width: 52, height: 52, bgcolor: "rgba(255,255,255,0.12)", color: "#8BC7FF", border: "1px solid rgba(255,255,255,0.16)" }}>
            <ApartmentRoundedIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1.5, fontSize: 36 }}>
              EstateFlow
            </Typography>
            <Typography sx={{ color: "#B7CBE0", fontSize: 13 }}>Property Management</Typography>
          </Box>
        </Stack>

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 750,
            maxWidth: 470,
            lineHeight: 1.2,
            letterSpacing: -0.8,
          }}
        >
          A better way to manage your rental property.
        </Typography>

        <Typography sx={{ color: "#C5D4E3", maxWidth: 440, mb: 4, mt: 1, lineHeight: 1.8 }}>
          One workspace for property owners and a simple, secure portal for tenants.
        </Typography>

        <Stack spacing={2}>
          <Typography sx={{ color: "#E3EDF7" }}>✓ Tenant and rental agreement management</Typography>
          <Typography sx={{ color: "#E3EDF7" }}>✓ Role-based owner and tenant experiences</Typography>
          <Typography sx={{ color: "#E3EDF7" }}>✓ Maintenance requests and status tracking</Typography>
          <Typography sx={{ color: "#E3EDF7" }}>✓ Local AI assistant for help and guidance</Typography>
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
            border: "1px solid #E7ECF2",
            boxShadow: "0 16px 50px rgba(20, 40, 68, 0.10)",
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

              <Typography sx={{ color: "text.secondary" }}>
                {isLoginMode
                  ? "Sign in to continue."
                  : "Create a tenant account. The property owner will link it to your tenancy."}
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

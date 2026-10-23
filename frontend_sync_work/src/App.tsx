
/**
 * ============================================================================
 * Application Root
 * ============================================================================
 *
 * Purpose
 * -------
 * Root component of the application.
 *
 * Responsibilities
 * ----------------
 * - Registers global UI providers.
 * - Configures browser-based routing.
 * - Renders application routes.
 * - Mounts the global floating AI chat widget.
 *
 * Learning Notes
 * --------------
 * Global application-level UI belongs here when it must remain mounted
 * across route changes.
 *
 * ============================================================================
 */

import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import { theme } from "@/theme";
import { AppRoutes } from "@/routes";
import { ChatWidget } from "@/features/chat/components";

/**
 * ============================================================================
 * Application Root Component
 * ============================================================================
 */
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        {/* Application route configuration */}
        <AppRoutes />

        {/* Global floating AI assistant */}
        <ChatWidget />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

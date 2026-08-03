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
 * - Renders the application.
 *
 * Learning Notes
 * --------------
 * Global providers are added here progressively as the application grows.
 *
 * ============================================================================
 */

import { CssBaseline, ThemeProvider } from "@mui/material";

import { theme } from "@/theme";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "@/routes";

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
                <AppRoutes />
            </BrowserRouter> 
        </ThemeProvider>
    );
};

export default App;
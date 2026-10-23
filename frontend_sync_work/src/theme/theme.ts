/**
 * ============================================================================
 * Material UI Theme
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines the global Material UI theme used throughout the application.
 *
 * Responsibilities
 * ----------------
 * - Configure application typography.
 * - Configure application colour palette.
 * - Configure default component behaviour.
 *
 * Learning Notes
 * --------------
 * Every Material UI component automatically inherits this theme.
 *
 * This allows us to maintain a consistent look and feel across the
 * entire application.
 *
 * ============================================================================
 */

import { createTheme } from "@mui/material/styles";

/**
 * ============================================================================
 * Application Theme
 * ============================================================================
 */
const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#1976D2",
        },

        secondary: {
            main: "#6c757d",
        },

        background: {
            default: "#F3F6FA",
            paper: "#ffffff",
        },
    },

    typography: {
        fontFamily: [
            "Inter",
            "Roboto",
            "Helvetica",
            "Arial",
            "sans-serif",
        ].join(","),

        h4: {
            fontWeight: 700,
            letterSpacing: "-0.025em",
        },

        h5: {
            fontWeight: 600,
        },

        h6: {
            fontWeight: 600,
        },

        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 8,
    },
});

export default theme;
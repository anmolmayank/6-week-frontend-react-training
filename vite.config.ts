/**
 * ============================================================================
 * Vite Configuration
 * ============================================================================
 *
 * Purpose
 * -------
 * Configures the Vite development server and build process.
 *
 * Responsibilities
 * ----------------
 * - Registers the React plugin.
 * - Configures absolute import aliases.
 * - Provides a single place for future Vite configuration.
 *
 * Learning Notes
 * --------------
 * Using an absolute import alias (`@`) avoids long relative imports such as:
 *
 * ../../../../components/Button
 *
 * Instead, we can simply write:
 *
 * @/shared/components/AppButton
 *
 * This significantly improves readability and maintainability in larger
 * applications.
 *
 * ============================================================================
 */

import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * ============================================================================
 * Vite Configuration
 * ============================================================================
 */
export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
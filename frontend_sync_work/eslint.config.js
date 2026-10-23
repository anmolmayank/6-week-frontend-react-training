/**
 * ============================================================================
 * File: eslint.config.js
 * ============================================================================
 *
 * Purpose
 * -------
 * ESLint configuration for the React + TypeScript frontend.
 *
 * Stack
 * -----
 * - React 19
 * - Vite 8
 * - TypeScript 6
 * - ESLint 10
 * - typescript-eslint
 * - React Hooks
 * - React Refresh
 *
 * ============================================================================
 */

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

import { defineConfig, globalIgnores } from "eslint/config";

/**
 * ============================================================================
 * ESLint Configuration
 * ============================================================================
 */

export default defineConfig([
    /**
     * ------------------------------------------------------------------------
     * Global ignores
     * ------------------------------------------------------------------------
     *
     * Vite's production build output should never be linted.
     */
    globalIgnores([
        "dist/**",
        "coverage/**",
        "node_modules/**",
    ]),

    /**
     * ------------------------------------------------------------------------
     * JavaScript + TypeScript + React
     * ------------------------------------------------------------------------
     */
    {
        files: ["**/*.{ts,tsx}"],

        extends: [
            /**
             * ESLint recommended JavaScript rules.
             */
            js.configs.recommended,

            /**
             * TypeScript recommended rules.
             */
            tseslint.configs.recommended,

            /**
             * React Hooks rules.
             */
            reactHooks.configs.flat.recommended,

            /**
             * React Fast Refresh / Vite rules.
             */
            reactRefresh.configs.vite,
        ],

        languageOptions: {
            /**
             * Browser globals such as:
             *
             * window
             * document
             * localStorage
             * fetch
             */
            globals: globals.browser,
        },

        rules: {
            /**
             * ================================================================
             * TypeScript
             * ================================================================
             */

            /**
             * Explicit `any` is discouraged.
             *
             * Keep this as a warning initially so the existing codebase
             * can be cleaned up gradually.
             */
            "@typescript-eslint/no-explicit-any": "warn",

            /**
             * Ignore intentionally unused variables beginning with "_".
             */
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],

            /**
             * Require type-only imports where appropriate.
             */
            "@typescript-eslint/consistent-type-imports": "error",

            /**
             * ================================================================
             * General JavaScript
             * ================================================================
             */

            /**
             * Debugger statements should never be committed.
             */
            "no-debugger": "error",

            /**
             * Prefer const when a variable isn't reassigned.
             */
            "prefer-const": "error",

            /**
             * Prefer object shorthand.
             */
            "object-shorthand": "error",
        },
    },
]);
/**
 * ============================================================================
 * Application Entry Point
 * ============================================================================
 *
 * Purpose
 * -------
 * Bootstraps the React application.
 *
 * Responsibilities
 * ----------------
 * - Creates the React root.
 * - Registers the Redux Provider.
 * - Renders the root application component.
 *
 * Learning Notes
 * --------------
 * This file should remain extremely small.
 * It should only compose global application providers.
 *
 * ============================================================================
 */

import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import App from "./App";

import { store } from "@/app/store";
import { SnackbarProvider } from "./feedback/SnackbarProvider";

/**
 * ============================================================================
 * Render Application
 * ============================================================================
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <SnackbarProvider>
                <App/>
            </SnackbarProvider>
        </Provider>
    </React.StrictMode>
);
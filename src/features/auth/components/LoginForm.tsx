/**
 * ============================================================================
 * Login Form
 * ============================================================================
 *
 * Purpose
 * -------
 * Displays the user login form.
 *
 * Responsibilities
 * ----------------
 * - Collect user credentials.
 * - Validate user input.
 * - Authenticate the user.
 * - Display authentication success/error feedback.
 * - Redirect to the dashboard appropriate to the authenticated user role.
 *
 * Learning Notes
 * --------------
 * - Form validation is handled by React Hook Form + Zod.
 * - Authentication is handled by RTK Query.
 * - User feedback is handled by the global Snackbar system.
 * - Authentication token persistence is handled by RTK Query.
 *
 * ============================================================================
 */

import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Stack, TextField } from "@mui/material";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "../api";

import {
    loginSchema,
    type LoginFormData,
} from "../validation";

import { getHomeRouteForRole } from "../utils/authSession";

import type { ApiErrorResponse } from "@/shared/models";

import { useSnackbar } from "@/feedback/useSnackbar";

/**
 * ============================================================================
 * Login Form
 * ============================================================================
 */

const LoginForm = () => {
    /**
     * ------------------------------------------------------------------------
     * Hooks
     * ------------------------------------------------------------------------
     */

    const navigate = useNavigate();

    /**
     * Global Snackbar notifications.
     */
    const {
        success,
        error: showError,
    } = useSnackbar();

    /**
     * Login mutation provided by RTK Query.
     */
    const [login, { isLoading }] =
        useLoginMutation();

    /**
     * ------------------------------------------------------------------------
     * Form Configuration
     * ------------------------------------------------------------------------
     */

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),

        defaultValues: {
            email: "",
            password: "",
        },
    });

    /**
     * ------------------------------------------------------------------------
     * Submit Handler
     * ------------------------------------------------------------------------
     */

    const onSubmit: SubmitHandler<LoginFormData> =
        async (formData) => {
            try {
                /**
                 * ------------------------------------------------------------
                 * Execute login request.
                 * ------------------------------------------------------------
                 *
                 * `.unwrap()` makes RTK Query throw when the request fails,
                 * allowing us to handle success and failure using try/catch.
                 */
                const response = await login(formData).unwrap();

                /**
                 * ------------------------------------------------------------
                 * Show success notification.
                 * ------------------------------------------------------------
                 */
                success("Login successful.");

                /**
                 * ------------------------------------------------------------
                 * Redirect to Tenant Dashboard.
                 * ------------------------------------------------------------
                 */
                void navigate(getHomeRouteForRole(response.data.user.role));
            } catch (error) {
                /**
                 * ------------------------------------------------------------
                 * Extract backend error message.
                 * ------------------------------------------------------------
                 */
                const apiResponse =
                    error as FetchBaseQueryError & {
                        data?: ApiErrorResponse;
                    };

                /**
                 * Use the backend-provided message when available.
                 *
                 * Otherwise display a safe generic message.
                 */
                const message =
                    apiResponse.data?.message ??
                    "Unable to login. Please try again.";

                /**
                 * ------------------------------------------------------------
                 * Display API error through global Snackbar.
                 * ------------------------------------------------------------
                 */
                showError(message);
            }
        };

    /**
     * ------------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------------
     */

    return (
        <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={3}
        >
            {/* -----------------------------------------------------------------
                Email Address
            ------------------------------------------------------------------ */}

            <TextField
                label="Email Address"
                type="email"
                fullWidth
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register("email")}
            />

            {/* -----------------------------------------------------------------
                Password
            ------------------------------------------------------------------ */}

            <TextField
                label="Password"
                type="password"
                fullWidth
                autoComplete="current-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register("password")}
            />

            {/* -----------------------------------------------------------------
                Submit Button
            ------------------------------------------------------------------ */}

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                size="large"
            >
                {isLoading
                    ? "Signing In..."
                    : "Sign In"}
            </Button>
        </Stack>
    );
};

export default LoginForm;
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
 * - Redirect to the Tenant Dashboard.
 *
 * Learning Notes
 * --------------
 * This component owns the complete login workflow.
 * Authentication token persistence is handled by RTK Query.
 *
 * ============================================================================
 */

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Alert,
    Button,
    Stack,
    TextField,
} from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
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

import { ROUTES } from "@/shared/constants";
import type { ApiErrorResponse } from "@/shared/models";

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

    const [login, { isLoading }] = useLoginMutation();

    /**
     * ------------------------------------------------------------------------
     * Local State
     * ------------------------------------------------------------------------
     */
    const [apiError, setApiError] = useState("");

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
    const onSubmit: SubmitHandler<LoginFormData> = async (
        formData,
    ) => {
        /**
         * Clear previous API errors.
         */
        setApiError("");

        try {
            /**
             * Execute login request.
             */
            await login(formData).unwrap();

            /**
             * Redirect to Tenant Dashboard.
             */
            navigate(ROUTES.TENANTS);
        } catch (error) {
            /**
             * Extract backend error message.
             */
            const apiResponse =
                error as FetchBaseQueryError & {
                    data?: ApiErrorResponse;
                };

            setApiError(
                apiResponse.data?.message ??
                    "Unable to login. Please try again.",
            );
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
            spacing={3}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            {/* -----------------------------------------------------------------
                API Error
            ------------------------------------------------------------------ */}
            {apiError && (
                <Alert severity="error">
                    {apiError}
                </Alert>
            )}

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
                {isLoading ? "Signing In..." : "Sign In"}
            </Button>
        </Stack>
    );
};

export default LoginForm;
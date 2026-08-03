/**
 * ============================================================================
 * Register Form
 * ============================================================================
 *
 * Purpose
 * -------
 * Displays the user registration form.
 *
 * Responsibilities
 * ----------------
 * - Collect user registration details.
 * - Validate user input.
 * - Create a new application user.
 * - Notify the parent component when registration succeeds.
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

import { useCreateUserMutation } from "@/features/users/api/user.endpoints";
import type { ApiErrorResponse } from "@/shared/models";

import {
    registerSchema,
    type RegisterFormData,
} from "../validation";

/**
 * ============================================================================
 * Component Props
 * ============================================================================
 */
interface RegisterFormProps {
    onRegistrationSuccess: () => void;
}

/**
 * ============================================================================
 * Register Form
 * ============================================================================
 */
const RegisterForm = ({
    onRegistrationSuccess,
}: RegisterFormProps) => {
    /**
     * ------------------------------------------------------------------------
     * Hooks
     * ------------------------------------------------------------------------
     */
    const [createUser, { isLoading }] =
        useCreateUserMutation();

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
        reset,
        formState: {
            errors,
        },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),

        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    /**
     * ------------------------------------------------------------------------
     * Submit Handler
     * ------------------------------------------------------------------------
     */
    const onSubmit: SubmitHandler<
        RegisterFormData
    > = async (formData) => {
        setApiError("");

        try {
            await createUser(formData).unwrap();

            /**
             * Clear form.
             */
            reset();

            /**
             * Switch back to Login screen.
             */
            onRegistrationSuccess();
        } catch (error) {
            const apiResponse =
                error as FetchBaseQueryError & {
                    data?: ApiErrorResponse;
                };

            setApiError(
                apiResponse.data?.message ??
                    "Unable to register user.",
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
            {apiError && (
                <Alert severity="error">
                    {apiError}
                </Alert>
            )}

            <TextField
                label="Full Name"
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                {...register("name")}
            />

            <TextField
                label="Email Address"
                type="email"
                fullWidth
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register("email")}
            />

            <TextField
                label="Password"
                type="password"
                fullWidth
                autoComplete="new-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register("password")}
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
            >
                {isLoading
                    ? "Creating Account..."
                    : "Create Account"}
            </Button>
        </Stack>
    );
};

export default RegisterForm;
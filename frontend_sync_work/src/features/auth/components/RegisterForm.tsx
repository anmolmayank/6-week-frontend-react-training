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
 * - Display registration success/error feedback.
 * - Notify the parent component when registration succeeds.
 *
 * Learning Notes
 * --------------
 * - Form validation is handled by React Hook Form + Zod.
 * - User creation is handled by RTK Query.
 * - API feedback is handled by the global Snackbar system.
 *
 * ============================================================================
 */

import { zodResolver } from "@hookform/resolvers/zod";

import {
    Button,
    Stack,
    TextField,
} from "@mui/material";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import { useCreateUserMutation } from "@/features/users/api/user.endpoints";

import { useSnackbar } from "@/feedback/useSnackbar";

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
    /**
     * Called after successful user registration.
     *
     * The parent component can use this callback to switch
     * back to the Login screen.
     */
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

    /**
     * User creation mutation provided by RTK Query.
     */
    const [
        createUser,
        { isLoading },
    ] = useCreateUserMutation();

    /**
     * Global Snackbar notifications.
     */
    const {
        success,
        error: showError,
    } = useSnackbar();

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
        try {
            /**
             * ------------------------------------------------------------
             * Create the user.
             * ------------------------------------------------------------
             *
             * `.unwrap()` converts an unsuccessful RTK Query response
             * into a rejected Promise so it can be handled by catch().
             */
            await createUser(formData).unwrap();

            /**
             * ------------------------------------------------------------
             * Reset the form after successful registration.
             * ------------------------------------------------------------
             */
            reset();

            /**
             * ------------------------------------------------------------
             * Show success notification.
             * ------------------------------------------------------------
             */
            success(
                "Account created. Please sign in; the property owner must link your account to your tenant record before tenant services are available.",
            );

            /**
             * ------------------------------------------------------------
             * Notify the parent component.
             * ------------------------------------------------------------
             *
             * The parent can now switch the UI back to Login.
             */
            onRegistrationSuccess();
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
             * Otherwise show a safe generic message.
             */
            const message =
                apiResponse.data?.message ??
                "Unable to register user.";

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
                Full Name
            ------------------------------------------------------------------ */}

            <TextField
                label="Full Name"
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                {...register("name")}
            />

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
                autoComplete="new-password"
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
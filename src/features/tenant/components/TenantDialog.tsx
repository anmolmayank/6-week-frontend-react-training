/**
 * ============================================================================
 * Tenant Dialog
 * ============================================================================
 *
 * Purpose
 * -------
 * Displays a dialog for creating a new tenant.
 *
 * Responsibilities
 * ----------------
 * - Collect tenant details.
 * - Validate tenant input.
 * - Create a tenant.
 * - Display success/error feedback through the global Snackbar.
 * - Close dialog after successful creation.
 *
 * ============================================================================
 */

import { zodResolver } from "@hookform/resolvers/zod";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
    Controller,
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import { useCreateTenantMutation } from "../api";

import {
    createTenantSchema,
    type CreateTenantFormData,
} from "../validation";

import { useSnackbar } from "@/feedback/useSnackbar";

import type { ApiErrorResponse } from "@/shared/models";

/**
 * ============================================================================
 * Component Props
 * ============================================================================
 */

export interface TenantDialogProps {
    /**
     * Controls dialog visibility.
     */
    open: boolean;

    /**
     * Close dialog callback.
     */
    onClose: () => void;
}

/**
 * ============================================================================
 * Tenant Dialog
 * ============================================================================
 */

const TenantDialog = ({
    open,
    onClose,
}: TenantDialogProps) => {
    /**
     * ------------------------------------------------------------------------
     * Hooks
     * ------------------------------------------------------------------------
     */

    /**
     * Tenant creation mutation provided by RTK Query.
     */
    const [
        createTenant,
        { isLoading },
    ] = useCreateTenantMutation();

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
        control,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm<CreateTenantFormData>({
        resolver: zodResolver(
            createTenantSchema,
        ),

        defaultValues: {
            tenantName: "",
            apartmentNumber: "",
            monthlyRent: 0,
        },
    });

    /**
     * ------------------------------------------------------------------------
     * Submit Handler
     * ------------------------------------------------------------------------
     */

    const onSubmit: SubmitHandler<
        CreateTenantFormData
    > = async (formData) => {
        try {
            /**
             * ------------------------------------------------------------
             * Create tenant.
             * ------------------------------------------------------------
             *
             * `.unwrap()` causes RTK Query to reject the Promise when
             * the API request fails.
             */
            await createTenant(
                formData,
            ).unwrap();

            /**
             * ------------------------------------------------------------
             * Reset form after successful creation.
             * ------------------------------------------------------------
             */
            reset();

            /**
             * ------------------------------------------------------------
             * Show success notification.
             * ------------------------------------------------------------
             */
            success(
                "Tenant created successfully.",
            );

            /**
             * ------------------------------------------------------------
             * Close the dialog.
             * ------------------------------------------------------------
             */
            onClose();
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
             * Use the backend-provided error message when available.
             */
            const message =
                apiResponse.data?.message ??
                "Unable to create tenant.";

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
        <Dialog
            open={open}
            onClose={
                isLoading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Add Tenant
            </DialogTitle>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <DialogContent>
                    {/* ========================================================
                        Tenant Name
                    ========================================================= */}

                    <Controller
                        name="tenantName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Tenant Name"
                                fullWidth
                                margin="normal"
                                error={Boolean(
                                    errors.tenantName,
                                )}
                                helperText={
                                    errors.tenantName
                                        ?.message
                                }
                            />
                        )}
                    />

                    {/* ========================================================
                        Apartment Number
                    ========================================================= */}

                    <Controller
                        name="apartmentNumber"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Apartment Number"
                                fullWidth
                                margin="normal"
                                error={Boolean(
                                    errors.apartmentNumber,
                                )}
                                helperText={
                                    errors
                                        .apartmentNumber
                                        ?.message
                                }
                            />
                        )}
                    />

                    {/* ========================================================
                        Monthly Rent
                    ========================================================= */}

                    <Controller
                        name="monthlyRent"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Monthly Rent"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={Boolean(
                                    errors.monthlyRent,
                                )}
                                helperText={
                                    errors.monthlyRent
                                        ?.message
                                }
                                onChange={(event) =>
                                    field.onChange(
                                        Number(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Saving..."
                            : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TenantDialog;
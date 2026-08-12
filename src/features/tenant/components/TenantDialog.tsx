/**
 * ============================================================================
 * Tenant Dialog
 * ============================================================================
 *
 * Purpose
 * -------
 * Displays a dialog for creating or editing a tenant.
 *
 * Responsibilities
 * ----------------
 * - Collect tenant details.
 * - Validate tenant input.
 * - Create a tenant.
 * - Update an existing tenant.
 * - Display success/error feedback through the global Snackbar.
 * - Close dialog after successful operation.
 *
 * ============================================================================
 */

import { useEffect } from "react";

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

import {
    useCreateTenantMutation,
    useUpdateTenantMutation,
} from "../api";

import type { Tenant } from "../models";

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

    /**
     * Determines whether the dialog is creating or editing.
     */
    mode?: "create" | "edit";

    /**
     * Tenant being edited.
     *
     * Required when mode is "edit".
     */
    tenant?: Tenant | null;
}

/**
 * ============================================================================
 * Default Form Values
 * ============================================================================
 */

const defaultFormValues: CreateTenantFormData = {
    tenantName: "",
    apartmentNumber: "",
    monthlyRent: 0,
};

/**
 * ============================================================================
 * Tenant Dialog
 * ============================================================================
 */

const TenantDialog = ({
    open,
    onClose,
    mode = "create",
    tenant = null,
}: TenantDialogProps) => {
    /**
     * ------------------------------------------------------------------------
     * Mutations
     * ------------------------------------------------------------------------
     */

    const [
        createTenant,
        {
            isLoading: isCreating,
        },
    ] = useCreateTenantMutation();

    const [
        updateTenant,
        {
            isLoading: isUpdating,
        },
    ] = useUpdateTenantMutation();

    /**
     * ------------------------------------------------------------------------
     * Feedback
     * ------------------------------------------------------------------------
     */

    const {
        success,
        error: showError,
    } = useSnackbar();

    /**
     * ------------------------------------------------------------------------
     * Loading State
     * ------------------------------------------------------------------------
     */

    const isLoading =
        isCreating || isUpdating;

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
        defaultValues:
            defaultFormValues,
    });

    /**
     * ------------------------------------------------------------------------
     * Populate Form
     * ------------------------------------------------------------------------
     *
     * Populate the form when editing an existing tenant.
     *
     * Reset the form when creating a new tenant.
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        if (
            mode === "edit" &&
            tenant
        ) {
            reset({
                tenantName:
                    tenant.tenantName,

                apartmentNumber:
                    tenant.apartmentNumber,

                monthlyRent:
                    tenant.monthlyRent,
            });

            return;
        }

        reset(defaultFormValues);
    }, [
        open,
        mode,
        tenant,
        reset,
    ]);

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
             * --------------------------------------------------------------
             * Edit Existing Tenant
             * --------------------------------------------------------------
             */
            if (
                mode === "edit" &&
                tenant
            ) {
                await updateTenant({
                    tenantId: tenant._id,
                    body: formData,
                }).unwrap();

                success(
                    "Tenant updated successfully.",
                );

                reset(
                    defaultFormValues,
                );

                onClose();

                return;
            }

            /**
             * --------------------------------------------------------------
             * Create New Tenant
             * --------------------------------------------------------------
             */

            await createTenant(
                formData,
            ).unwrap();

            success(
                "Tenant created successfully.",
            );

            reset(
                defaultFormValues,
            );

            onClose();
        } catch (error) {
            /**
             * --------------------------------------------------------------
             * Extract Backend Error
             * --------------------------------------------------------------
             */

            const apiResponse =
                error as FetchBaseQueryError & {
                    data?: ApiErrorResponse;
                };

            let errorMessage =
                "Unable to create tenant.";

            if (mode === "edit") {
                errorMessage =
                    "Unable to update tenant.";
            }

            showError(
                apiResponse.data?.message ??
                    errorMessage,
            );
        }
    };

    /**
     * ------------------------------------------------------------------------
     * Close Handler
     * ------------------------------------------------------------------------
     *
     * Prevent closing while an API operation is running.
     */

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        reset(defaultFormValues);

        onClose();
    };

    /**
     * ------------------------------------------------------------------------
     * Submit Button Label
     * ------------------------------------------------------------------------
     *
     * Avoid nested ternary expressions for readability.
     */

    let submitButtonLabel = "Save";

    if (isLoading) {
        submitButtonLabel = "Saving...";
    } else if (mode === "edit") {
        submitButtonLabel = "Update";
    }

    /**
     * ------------------------------------------------------------------------
     * Dialog Title
     * ------------------------------------------------------------------------
     */

    let dialogTitle = "Add Tenant";

    if (mode === "edit") {
        dialogTitle = "Edit Tenant";
    }

    /**
     * ------------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------------
     */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {dialogTitle}
            </DialogTitle>

            <form
                onSubmit={handleSubmit(
                    onSubmit,
                )}
                noValidate
            >
                <DialogContent>
                    {/* ========================================================
                        Tenant Name
                    ========================================================= */}

                    <Controller
                        name="tenantName"
                        control={control}
                        render={({
                            field,
                        }) => (
                            <TextField
                                {...field}
                                label="Tenant Name"
                                fullWidth
                                margin="normal"
                                error={Boolean(
                                    errors.tenantName,
                                )}
                                helperText={
                                    errors
                                        .tenantName
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
                        render={({
                            field,
                        }) => (
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
                        render={({
                            field,
                        }) => (
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
                                    errors
                                        .monthlyRent
                                        ?.message
                                }
                                onChange={(
                                    event,
                                ) =>
                                    field.onChange(
                                        Number(
                                            event
                                                .target
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
                        onClick={
                            handleClose
                        }
                        disabled={
                            isLoading
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={
                            isLoading
                        }
                    >
                        {submitButtonLabel}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TenantDialog;
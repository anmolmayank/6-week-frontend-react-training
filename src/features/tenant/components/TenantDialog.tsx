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
 * - Validate user input.
 * - Create a tenant.
 * * Close dialog after successful creation.
 *
 * ============================================================================
 */

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
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
    const [createTenant, { isLoading }] =
        useCreateTenantMutation();

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
        control,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm<CreateTenantFormData>({
        resolver: zodResolver(createTenantSchema),

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
        setApiError("");

        try {
            await createTenant(formData).unwrap();

            reset();

            onClose();
        } catch (error) {
            const apiResponse =
                error as FetchBaseQueryError & {
                    data?: ApiErrorResponse;
                };

            setApiError(
                apiResponse.data?.message ??
                    "Unable to create tenant.",
            );
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
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Add Tenant
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent>
                    {apiError && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {apiError}
                        </Alert>
                    )}

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
                                error={Boolean(errors.tenantName)}
                                helperText={
                                    errors.tenantName?.message
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
                                error={Boolean(errors.apartmentNumber)}
                                helperText={
                                    errors.apartmentNumber?.message
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
                                error={Boolean(errors.monthlyRent)}
                                helperText={
                                    errors.monthlyRent?.message
                                }
                                onChange={(event) =>
                                    field.onChange(
                                        Number(event.target.value),
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
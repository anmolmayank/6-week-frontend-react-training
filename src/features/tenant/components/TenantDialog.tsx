/**
 * ============================================================================
 * Tenant Dialog
 * ============================================================================
 *
 * Purpose
 * -------
 * Creates or edits a tenant and manages the tenant's rental agreement.
 *
 * Responsibilities
 * ----------------
 * - Validate and save tenant details.
 * - Optionally upload an agreement when creating a tenant.
 * - Replace or remove the agreement while editing a tenant.
 * - Report partial-success scenarios clearly.
 * - Display feedback through the global Snackbar.
 *
 * ============================================================================
 */

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";

import {
    Controller,
    useForm,
    type SubmitHandler,
} from "react-hook-form";

import {
    useCreateTenantMutation,
    useDeleteAgreementMutation,
    useUpdateTenantMutation,
    useUploadAgreementMutation,
} from "../api";

import type { Tenant } from "../models";

import {
    createTenantSchema,
    type CreateTenantFormData,
} from "../validation";

import { useSnackbar } from "@/feedback/useSnackbar";
import { getApiErrorMessage } from "@/shared/utils";

/** Maximum agreement upload size supported by the Node upload middleware. */
const MAX_AGREEMENT_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * ============================================================================
 * Component Props
 * ============================================================================
 */
export interface TenantDialogProps {
    readonly open: boolean;
    readonly onClose: () => void;
    readonly mode?: "create" | "edit";
    readonly tenant?: Tenant | null;
}

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
    const [createTenant, { isLoading: isCreating }] = useCreateTenantMutation();
    const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();
    const [uploadAgreement, { isLoading: isUploadingAgreement }] = useUploadAgreementMutation();
    const [deleteAgreement, { isLoading: isDeletingAgreement }] = useDeleteAgreementMutation();

    const { success, error: showError } = useSnackbar();

    const [agreementFile, setAgreementFile] = useState<File | null>(null);
    const [agreementFileError, setAgreementFileError] = useState<string | null>(null);
    const [removeExistingAgreement, setRemoveExistingAgreement] = useState(false);

    const isLoading =
        isCreating ||
        isUpdating ||
        isUploadingAgreement ||
        isDeletingAgreement;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTenantFormData>({
        resolver: zodResolver(createTenantSchema),
        // TenantDialog is mounted only while open, so initialize the form from
        // the selected tenant instead of synchronizing form state in an effect.
        defaultValues:
            mode === "edit" && tenant
                ? {
                    tenantName: tenant.tenantName,
                    apartmentNumber: tenant.apartmentNumber,
                    monthlyRent: tenant.monthlyRent,
                }
                : defaultFormValues,
    });

    /** Validate the agreement before submitting it to the API. */
    const handleAgreementFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) {
            return;
        }

        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        if (!isPdf) {
            setAgreementFile(null);
            setAgreementFileError("Choose a PDF file for the rental agreement.");
            return;
        }

        if (file.size > MAX_AGREEMENT_SIZE_BYTES) {
            setAgreementFile(null);
            setAgreementFileError("The agreement must be 10 MB or smaller.");
            return;
        }

        setAgreementFile(file);
        setAgreementFileError(null);
        setRemoveExistingAgreement(false);
    };

    /** Reset form-only state after a successful workflow. */
    const resetAndClose = () => {
        reset(defaultFormValues);
        setAgreementFile(null);
        setAgreementFileError(null);
        setRemoveExistingAgreement(false);
        onClose();
    };

    const onSubmit: SubmitHandler<CreateTenantFormData> = async (formData) => {
        if (agreementFileError) {
            return;
        }

        let savedTenant: Tenant;

        // Step 1: Save tenant details. Do not upload a file until a tenant ID exists.
        try {
            if (mode === "edit" && tenant) {
                const response = await updateTenant({
                    tenantId: tenant._id,
                    body: formData,
                }).unwrap();
                savedTenant = response.data;
            } else {
                const response = await createTenant(formData).unwrap();
                savedTenant = response.data;
            }
        } catch (error) {
            const fallback = mode === "edit"
                ? "Unable to update tenant details."
                : "Unable to create tenant.";
            showError(getApiErrorMessage(error, fallback));
            return;
        }

        // Step 2: Optionally upload/replace the agreement for that tenant.
        if (agreementFile) {
            try {
                await uploadAgreement({
                    tenantId: savedTenant._id,
                    file: agreementFile,
                }).unwrap();

                success(mode === "edit"
                    ? "Tenant details and rental agreement updated successfully."
                    : "Tenant created and rental agreement uploaded successfully.");
                resetAndClose();
                return;
            } catch (error) {
                // Tenant create/update already succeeded. Close the dialog to prevent
                // duplicate tenant creation if the user retries after an upload error.
                const action = mode === "edit" ? "Tenant details were saved" : "Tenant was created";
                showError(
                    `${action}, but the agreement upload failed. You can upload it from the tenant row. ${getApiErrorMessage(error, "Please try again.")}`,
                );
                resetAndClose();
                return;
            }
        }

        // Step 3: In edit mode, remove the existing agreement only when explicitly requested.
        if (mode === "edit" && tenant?.rentalAgreement && removeExistingAgreement) {
            try {
                await deleteAgreement(savedTenant._id).unwrap();
                success("Tenant details saved and rental agreement removed.");
                resetAndClose();
                return;
            } catch (error) {
                showError(
                    `Tenant details were saved, but the agreement could not be removed. ${getApiErrorMessage(error, "Please try again.")}`,
                );
                resetAndClose();
                return;
            }
        }

        success(mode === "edit" ? "Tenant updated successfully." : "Tenant created successfully.");
        resetAndClose();
    };

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        reset(defaultFormValues);
        setAgreementFile(null);
        setAgreementFileError(null);
        setRemoveExistingAgreement(false);
        onClose();
    };

    let submitButtonLabel = "Save Tenant";
    if (isLoading) {
        submitButtonLabel = "Saving...";
    } else if (mode === "edit") {
        submitButtonLabel = "Save Changes";
    }

    const dialogTitle = mode === "edit" ? "Edit Tenant" : "Add Tenant";

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{dialogTitle}</DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent>
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
                                helperText={errors.tenantName?.message}
                            />
                        )}
                    />

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
                                helperText={errors.apartmentNumber?.message}
                            />
                        )}
                    />

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
                                helperText={errors.monthlyRent?.message}
                                onChange={(event) => field.onChange(Number(event.target.value))}
                            />
                        )}
                    />

                    <Stack spacing={1} sx={{ mt: 2.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>
                            Rental Agreement <Typography component="span" sx={{ color: "text.secondary", fontSize: 12, fontWeight: 400 }}>(optional PDF, max 10 MB)</Typography>
                        </Typography>

                        {mode === "edit" && tenant?.rentalAgreement && (
                            <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                                Current file: {tenant.rentalAgreement.originalName}
                            </Typography>
                        )}

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: { xs: "stretch", sm: "center" } }}>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadRoundedIcon />}
                                disabled={isLoading}
                            >
                                {agreementFile ? "Choose a different PDF" : mode === "edit" && tenant?.rentalAgreement ? "Replace Agreement" : "Choose Agreement PDF"}
                                <input
                                    hidden
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    onChange={handleAgreementFileChange}
                                />
                            </Button>
                            {agreementFile && (
                                <Typography sx={{ fontSize: 12, overflowWrap: "anywhere" }}>
                                    Selected: {agreementFile.name}
                                </Typography>
                            )}
                        </Stack>

                        {(agreementFile || agreementFileError) && (
                            <Button
                                size="small"
                                color="inherit"
                                onClick={() => {
                                    setAgreementFile(null);
                                    setAgreementFileError(null);
                                }}
                                disabled={isLoading}
                                sx={{ alignSelf: "flex-start" }}
                            >
                                Clear file selection
                            </Button>
                        )}

                        {agreementFileError && (
                            <Typography role="alert" sx={{ color: "error.main", fontSize: 12 }}>
                                {agreementFileError}
                            </Typography>
                        )}

                        {mode === "edit" && tenant?.rentalAgreement && !agreementFile && (
                            <FormControlLabel
                                control={(
                                    <Checkbox
                                        checked={removeExistingAgreement}
                                        disabled={isLoading}
                                        onChange={(event) => setRemoveExistingAgreement(event.target.checked)}
                                    />
                                )}
                                label="Remove the current agreement when saving"
                                sx={{ alignItems: "flex-start", "& .MuiFormControlLabel-label": { fontSize: 12.5 } }}
                            />
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading || Boolean(agreementFileError)}
                    >
                        {submitButtonLabel}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TenantDialog;

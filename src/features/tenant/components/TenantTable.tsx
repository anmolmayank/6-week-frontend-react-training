/**
 * ============================================================================
 * Tenant Table
 * ============================================================================
 *
 * Purpose
 * -------
 * Displays all tenant records and their rental agreement actions.
 *
 * Responsibilities
 * ----------------
 * - Fetch tenant records.
 * - Display tenant records.
 * - Edit tenant records.
 * - Upload rental agreements.
 * - Replace rental agreements.
 * - Delete rental agreements.
 * - Download rental agreements.
 * - Request tenant deletion with confirmation.
 * - Confirm destructive actions.
 * - Display user feedback through the global Snackbar.
 *
 * ============================================================================
 */

import { useState } from "react";

import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
    useDeleteAgreementMutation,
    useDeleteTenantMutation,
    useDownloadAgreementMutation,
    useGetTenantsQuery,
    useUploadAgreementMutation,
} from "../api";
import type { Tenant } from "../models";
import TenantTableRow from "./TenantTableRow";
import { ConfirmDialog } from "@/feedback/ConfirmDialog";
import { useSnackbar } from "@/feedback/useSnackbar";
import {
    getApiErrorMessage,
} from "@/shared/utils";
/**
 * ============================================================================
 * Component Props
 * ============================================================================
 */

export interface TenantTableProps {
    /**
     * Called when the user selects a tenant for editing.
     */
    onEdit: (tenant: Tenant) => void;
}

/**
 * ============================================================================
 * Tenant Table
 * ============================================================================
 */

const TenantTable = ({
    onEdit,
}: TenantTableProps) => {
    /**
     * ------------------------------------------------------------------------
     * Local State
     * ------------------------------------------------------------------------
     */

    /** Stores the tenant ID whose rental agreement is awaiting deletion confirmation. */
    const [
        agreementTenantToDelete,
        setAgreementTenantToDelete,
    ] = useState<string | null>(null);

    /** Tenant record awaiting confirmation for permanent removal. */
    const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);

    /** Client-side search across tenant name and apartment number. */
    const [searchTerm, setSearchTerm] = useState("");

    /**
     * ------------------------------------------------------------------------
     * Snackbar
     * ------------------------------------------------------------------------
     */

    const {
        success,
        error: showError,
    } = useSnackbar();

    /**
     * ------------------------------------------------------------------------
     * Tenant Query
     * ------------------------------------------------------------------------
     */

    const {
        data,
        isLoading,
        isError,
    } = useGetTenantsQuery();

    /**
     * ------------------------------------------------------------------------
     * Mutations
     * ------------------------------------------------------------------------
     */

    /**
     * Upload / replace rental agreement.
     */
    const [
        uploadAgreement,
        {
            isLoading: isUploading,
        },
    ] = useUploadAgreementMutation();

    /**
     * Download rental agreement.
     */
    const [
        downloadAgreement,
    ] = useDownloadAgreementMutation();

    /**
     * Delete rental agreement.
     */
    const [
        deleteAgreement,
        {
            isLoading: isDeletingAgreement,
        },
    ] = useDeleteAgreementMutation();

    const [
        deleteTenant,
        {
            isLoading: isDeletingTenant,
        },
    ] = useDeleteTenantMutation();

    /**
     * ------------------------------------------------------------------------
     * Upload Agreement
     * ------------------------------------------------------------------------
     */

    const handleUpload = async (
        tenantId: string,
        file: File,
    ) => {
        try {
            await uploadAgreement({
                tenantId,
                file,
            }).unwrap();

            success(
                "Rental agreement uploaded successfully.",
            );
        } catch (error) {
            showError(
                getApiErrorMessage(
                    error,
                    "Unable to upload rental agreement.",
                ),
            );
        }
    };

    /**
     * ------------------------------------------------------------------------
     * Replace Agreement
     * ------------------------------------------------------------------------
     */

    const handleReplace = async (
        tenantId: string,
        file: File,
    ) => {
        try {
            await uploadAgreement({
                tenantId,
                file,
            }).unwrap();

            success(
                "Rental agreement replaced successfully.",
            );
        } catch (error) {
            showError(
                getApiErrorMessage(
                    error,
                    "Unable to replace rental agreement.",
                ),
            );
        }
    };

    /**
     * ------------------------------------------------------------------------
     * Request Delete Confirmation
     * ------------------------------------------------------------------------
     */

    const handleDeleteRequest = (
        tenantId: string,
    ) => {
        setAgreementTenantToDelete(
            tenantId,
        );
    };

    /**
     * ------------------------------------------------------------------------
     * Cancel Delete
     * ------------------------------------------------------------------------
     */

    const handleCancelDelete = () => {
        setAgreementTenantToDelete(null);
    };

    /**
     * ------------------------------------------------------------------------
     * Confirm Agreement Delete
     * ------------------------------------------------------------------------
     */

    const handleConfirmDeleteAgreement = async () => {
        if (!agreementTenantToDelete) {
            return;
        }

        try {
            await deleteAgreement(agreementTenantToDelete).unwrap();
            success("Rental agreement deleted successfully.");
            setAgreementTenantToDelete(null);
        } catch (error) {
            showError(
                getApiErrorMessage(error, "Unable to delete rental agreement."),
            );
        }
    };

    /** Request confirmation before removing the tenant record. */
    const handleDeleteTenantRequest = (tenant: Tenant) => {
        setTenantToDelete(tenant);
    };

    const handleCancelDeleteTenant = () => {
        if (!isDeletingTenant) {
            setTenantToDelete(null);
        }
    };

    const handleConfirmDeleteTenant = async () => {
        if (!tenantToDelete) {
            return;
        }

        try {
            await deleteTenant(tenantToDelete._id).unwrap();
            success(`Tenant ${tenantToDelete.tenantName} deleted successfully.`);
            setTenantToDelete(null);
        } catch (error) {
            showError(
                getApiErrorMessage(
                    error,
                    "Unable to delete tenant. Ensure the backend exposes DELETE /api/v1/tenants/:tenantId.",
                ),
            );
        }
    };

    /**
     * ------------------------------------------------------------------------
     * Download Agreement
     * ------------------------------------------------------------------------
     */

    const handleDownload = async (
        tenantId: string,
    ) => {
        try {
            const blob =
                await downloadAgreement(
                    tenantId,
                ).unwrap();

            const url =
                window.URL.createObjectURL(
                    blob,
                );

            const link =
                document.createElement("a");

            link.href = url;
            link.download =
                "RentalAgreement.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                url,
            );
        } catch (error) {
            showError(
                getApiErrorMessage(
                    error,
                    "Unable to download rental agreement.",
                ),
            );
        }
    };

    /**
     * ------------------------------------------------------------------------
     * Loading State
     * ------------------------------------------------------------------------
     */

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 5,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    /**
     * ------------------------------------------------------------------------
     * Error State
     * ------------------------------------------------------------------------
     */

    if (isError) {
        return (
            <Paper sx={{ p: 4 }}>
                Unable to load tenants.
            </Paper>
        );
    }

    /**
     * ------------------------------------------------------------------------
     * Empty State
     * ------------------------------------------------------------------------
     */

    if (
        !data ||
        data.data.length === 0
    ) {
        return (
            <Paper sx={{ p: 4 }}>
                No tenants found.
            </Paper>
        );
    }

    /**
     * ------------------------------------------------------------------------
     * Filter Tenant Rows
     * ------------------------------------------------------------------------
     */
    const tenants = data?.data ?? [];
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
    const filteredTenants = tenants.filter((tenant) =>
        tenant.tenantName.toLocaleLowerCase().includes(normalizedSearch)
        || tenant.apartmentNumber.toLocaleLowerCase().includes(normalizedSearch),
    );

    /**
     * ------------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------------
     */
    return (
        <>
            <Paper elevation={0} sx={{ border: "1px solid #E6ECF3", borderRadius: 3, overflow: "hidden" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        p: 2,
                    }}
                >
                    <Box>
                        <Typography sx={{ fontSize: 15, fontWeight: 750, color: "#182D49" }}>
                            All tenants
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, mt: 0.25, color: "text.secondary" }}>
                            {filteredTenants.length} of {tenants.length} tenant records
                        </Typography>
                    </Box>
                    <TextField
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search name or apartment…"
                        size="small"
                        aria-label="Search tenants by name or apartment"
                        sx={{ width: { xs: "100%", sm: 280 }, "& .MuiOutlinedInput-root": { bgcolor: "#FFFFFF", borderRadius: 2, fontSize: 12.5 } }}
                        slotProps={{ input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon fontSize="small" sx={{ color: "#7A8BA0" }} />
                                </InputAdornment>
                            ),
                        } }}
                    />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: "#F8FAFD" }}>
                            <TableRow>
                                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: "#728197", letterSpacing: 0.6 }}>TENANT</TableCell>
                                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: "#728197", letterSpacing: 0.6 }}>APARTMENT</TableCell>
                                <TableCell align="right" sx={{ fontSize: 10, fontWeight: 800, color: "#728197", letterSpacing: 0.6 }}>MONTHLY RENT</TableCell>
                                <TableCell sx={{ fontSize: 10, fontWeight: 800, color: "#728197", letterSpacing: 0.6 }}>AGREEMENT</TableCell>
                                <TableCell align="center" sx={{ fontSize: 10, fontWeight: 800, color: "#728197", letterSpacing: 0.6 }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTenants.map((tenant) => (
                                <TenantTableRow
                                    key={tenant._id}
                                    tenant={tenant}
                                    onEdit={() => onEdit(tenant)}
                                    onUpload={(file) => handleUpload(tenant._id, file)}
                                    onReplace={(file) => handleReplace(tenant._id, file)}
                                    onDelete={() => handleDeleteRequest(tenant._id)}
                                    onDeleteTenant={() => handleDeleteTenantRequest(tenant)}
                                    onDownload={() => handleDownload(tenant._id)}
                                    isUploading={isUploading}
                                />
                            ))}
                        </TableBody>
                    </Table>
                    {filteredTenants.length === 0 && (
                        <Box sx={{ py: 5, px: 2, textAlign: "center" }}>
                            <Typography sx={{ fontWeight: 650, fontSize: 13 }}>No matching tenants</Typography>
                            <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: 12 }}>Try another name or apartment number.</Typography>
                        </Box>
                    )}
                </TableContainer>
            </Paper>

            {/* ================================================================
                Delete Confirmation
            ================================================================= */}

            <ConfirmDialog
                open={agreementTenantToDelete !== null}
                title="Delete Rental Agreement?"
                message={
                    "Are you sure you want to delete this rental agreement? " +
                    "The tenant record will remain. This action cannot be undone."
                }
                confirmText="Delete Agreement"
                cancelText="Cancel"
                loading={isDeletingAgreement}
                onConfirm={handleConfirmDeleteAgreement}
                onCancel={handleCancelDelete}
            />

            <ConfirmDialog
                open={tenantToDelete !== null}
                title="Delete Tenant?"
                message={(
                    <>
                        Are you sure you want to remove <strong>{tenantToDelete?.tenantName}</strong>?
                        <br />
                        This removes the tenant record. Confirm that your backend handles any linked agreement files and related records safely.
                    </>
                )}
                confirmText="Delete Tenant"
                cancelText="Keep Tenant"
                loading={isDeletingTenant}
                onConfirm={handleConfirmDeleteTenant}
                onCancel={handleCancelDeleteTenant}
            />
        </>
    );
};

export default TenantTable;
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
} from "@mui/material";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
    useDeleteAgreementMutation,
    useDownloadAgreementMutation,
    useGetTenantsQuery,
    useUploadAgreementMutation,
} from "../api";

import type { Tenant } from "../models";

import TenantTableRow from "./TenantTableRow";

import { ConfirmDialog } from "@/feedback/ConfirmDialog";
import { useSnackbar } from "@/feedback/useSnackbar";

import type { ApiErrorResponse } from "@/shared/models";

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

    /**
     * Stores the tenant ID whose rental agreement is awaiting deletion
     * confirmation.
     *
     * `null` means no deletion is currently awaiting confirmation.
     */
    const [
        tenantToDelete,
        setTenantToDelete,
    ] = useState<string | null>(null);

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
            isLoading: isDeleting,
        },
    ] = useDeleteAgreementMutation();

    /**
     * ------------------------------------------------------------------------
     * Error Message Helper
     * ------------------------------------------------------------------------
     */

    const getErrorMessage = (
        error: unknown,
        fallbackMessage: string,
    ) => {
        const apiResponse =
            error as FetchBaseQueryError & {
                data?: ApiErrorResponse;
            };

        return (
            apiResponse.data?.message ??
            fallbackMessage
        );
    };

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
                getErrorMessage(
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
                getErrorMessage(
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
        setTenantToDelete(
            tenantId,
        );
    };

    /**
     * ------------------------------------------------------------------------
     * Cancel Delete
     * ------------------------------------------------------------------------
     */

    const handleCancelDelete = () => {
        setTenantToDelete(null);
    };

    /**
     * ------------------------------------------------------------------------
     * Confirm Delete
     * ------------------------------------------------------------------------
     */

    const handleConfirmDelete = async () => {
        if (!tenantToDelete) {
            return;
        }

        try {
            await deleteAgreement(
                tenantToDelete,
            ).unwrap();

            success(
                "Rental agreement deleted successfully.",
            );

            setTenantToDelete(null);
        } catch (error) {
            showError(
                getErrorMessage(
                    error,
                    "Unable to delete rental agreement.",
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
                getErrorMessage(
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
     * Render
     * ------------------------------------------------------------------------
     */

    return (
        <>
            <TableContainer
                component={Paper}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Tenant
                            </TableCell>

                            <TableCell>
                                Apartment
                            </TableCell>

                            <TableCell align="right">
                                Monthly Rent
                            </TableCell>

                            <TableCell>
                                Agreement
                            </TableCell>

                            <TableCell align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.data.map(
                            (tenant) => (
                                <TenantTableRow
                                    key={
                                        tenant._id
                                    }
                                    tenant={
                                        tenant
                                    }
                                    onEdit={() =>
                                        onEdit(
                                            tenant,
                                        )
                                    }
                                    onUpload={(
                                        file,
                                    ) =>
                                        handleUpload(
                                            tenant._id,
                                            file,
                                        )
                                    }
                                    onReplace={(
                                        file,
                                    ) =>
                                        handleReplace(
                                            tenant._id,
                                            file,
                                        )
                                    }
                                    onDelete={() =>
                                        handleDeleteRequest(
                                            tenant._id,
                                        )
                                    }
                                    onDownload={() =>
                                        handleDownload(
                                            tenant._id,
                                        )
                                    }
                                    isUploading={
                                        isUploading
                                    }
                                />
                            ),
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ================================================================
                Delete Confirmation
            ================================================================= */}

            <ConfirmDialog
                open={
                    tenantToDelete !== null
                }
                title="Delete Rental Agreement?"
                message={
                    "Are you sure you want to delete this rental agreement? " +
                    "This action cannot be undone."
                }
                confirmText="Delete"
                cancelText="Cancel"
                loading={isDeleting}
                onConfirm={
                    handleConfirmDelete
                }
                onCancel={
                    handleCancelDelete
                }
            />
        </>
    );
};

export default TenantTable;
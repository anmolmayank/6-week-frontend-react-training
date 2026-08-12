/**
 * ============================================================================
 * Tenant Page
 * ============================================================================
 *
 * Purpose
 * -------
 * Displays the Tenant Management page.
 *
 * Responsibilities
 * ----------------
 * - Display page heading.
 * - Display page actions.
 * - Display tenant table.
 * - Open Tenant dialog for creating a tenant.
 * - Open Tenant dialog for editing a tenant.
 * - Close Tenant dialog.
 *
 * ============================================================================
 */

import { useState } from "react";

import {
    Box,
    Button,
    Typography,
} from "@mui/material";

import TenantDialog from "../components/TenantDialog";
import TenantTable from "../components/TenantTable";

import type { Tenant } from "../models";

/**
 * ============================================================================
 * Tenant Page
 * ============================================================================
 */

const TenantPage = () => {
    /**
     * ------------------------------------------------------------------------
     * Local State
     * ------------------------------------------------------------------------
     *
     * `null` means the dialog is in create mode.
     *
     * A Tenant object means the dialog is in edit mode.
     */
    const [
        selectedTenant,
        setSelectedTenant,
    ] = useState<Tenant | null>(null);

    /**
     * ------------------------------------------------------------------------
     * Dialog State
     * ------------------------------------------------------------------------
     *
     * The dialog can be open even when no tenant is selected.
     *
     * This allows the same dialog to handle:
     *
     * Create → selectedTenant = null
     * Edit   → selectedTenant = Tenant
     */
    const [
        isDialogOpen,
        setIsDialogOpen,
    ] = useState(false);

    /**
     * ------------------------------------------------------------------------
     * Add Tenant
     * ------------------------------------------------------------------------
     */

    const handleOpenCreateDialog =
        () => {
            setSelectedTenant(null);
            setIsDialogOpen(true);
        };

    /**
     * ------------------------------------------------------------------------
     * Edit Tenant
     * ------------------------------------------------------------------------
     */

    const handleOpenEditDialog = (
        tenant: Tenant,
    ) => {
        setSelectedTenant(tenant);
        setIsDialogOpen(true);
    };

    /**
     * ------------------------------------------------------------------------
     * Close Dialog
     * ------------------------------------------------------------------------
     */

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedTenant(null);
    };

    /**
     * ------------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------------
     */

    return (
        <>
            <Box>
                {/* ============================================================
                    Page Header
                ============================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Tenant Management
                        </Typography>

                        <Typography color="text.secondary">
                            Manage tenant records and rental agreements.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={
                            handleOpenCreateDialog
                        }
                    >
                        Add Tenant
                    </Button>
                </Box>

                {/* ============================================================
                    Tenant Table
                ============================================================= */}

                <TenantTable
                    onEdit={
                        handleOpenEditDialog
                    }
                />
            </Box>

            {/* ================================================================
                Tenant Dialog
            ================================================================= */}

            <TenantDialog
                open={isDialogOpen}
                onClose={
                    handleCloseDialog
                }
                mode={
                    selectedTenant
                        ? "edit"
                        : "create"
                }
                tenant={
                    selectedTenant
                }
            />
        </>
    );
};

export default TenantPage;
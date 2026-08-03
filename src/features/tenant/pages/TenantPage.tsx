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
 * - Open/Close Tenant dialog.
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
     */
    const [isDialogOpen, setIsDialogOpen] =
        useState(false);

    /**
     * ------------------------------------------------------------------------
     * Event Handlers
     * ------------------------------------------------------------------------
     */
    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
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
                        onClick={handleOpenDialog}
                    >
                        Add Tenant
                    </Button>
                </Box>

                {/* ============================================================
                    Tenant Table
                ============================================================= */}
                <TenantTable />
            </Box>

            {/* ================================================================
                Tenant Dialog
            ================================================================= */}
            <TenantDialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
            />
        </>
    );
};

export default TenantPage;
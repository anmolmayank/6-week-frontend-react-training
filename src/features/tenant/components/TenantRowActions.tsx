/**
 * ============================================================================
 * Tenant Row Actions
 * ============================================================================
 *
 * Purpose
 * -------
 * Displays actions for a tenant record and rental agreement.
 *
 * Responsibilities
 * ----------------
 * - Edit tenant.
 * - Upload agreement.
 * - Replace agreement.
 * - Delete agreement.
 * - Request tenant deletion.
 *
 * ============================================================================
 */

import { useRef } from "react";

import { Box, Button, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import type { RentalAgreement } from "../models";

/**
 * ============================================================================
 * Component Props
 * ============================================================================
 */
export interface TenantRowActionsProps {
    agreement: RentalAgreement | null;

    isUploading?: boolean;

    onEdit: () => void;

    onUpload: (file: File) => void;

    onReplace: (file: File) => void;

    onDelete: () => void;

    onDeleteTenant: () => void;
}

/**
 * ============================================================================
 * Tenant Row Actions
 * ============================================================================
 */
const TenantRowActions = ({
    agreement,
    isUploading = false,
    onEdit,
    onUpload,
    onReplace,
    onDelete,
    onDeleteTenant,
}: TenantRowActionsProps) => {
    /**
     * ------------------------------------------------------------------------
     * File Input Reference
     * ------------------------------------------------------------------------
     */
    const inputRef =
        useRef<HTMLInputElement>(null);

    /**
     * ------------------------------------------------------------------------
     * Open File Picker
     * ------------------------------------------------------------------------
     */
    const handleChooseFile = () => {
        inputRef.current?.click();
    };

    /**
     * ------------------------------------------------------------------------
     * File Selected
     * ------------------------------------------------------------------------
     */
    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (agreement) {
            onReplace(file);
        } else {
            onUpload(file);
        }

        /**
         * Allow selecting the same file again.
         */
        event.target.value = "";
    };

    /**
     * ------------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------------
     */
    return (
        <>
            <input
                ref={inputRef}
                type="file"
                hidden
                accept="application/pdf"
                onChange={
                    handleFileChange
                }
            />

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                }}
            >
                {/* ============================================================
                    Edit Tenant
                ============================================================= */}
                <Button
                    size="small"
                    variant="outlined"
                    onClick={onEdit}
                    disabled={isUploading}
                >
                    Edit
                </Button>

                {/* ============================================================
                    Upload / Replace Agreement
                ============================================================= */}
                <Button
                    size="small"
                    variant="outlined"
                    onClick={
                        handleChooseFile
                    }
                    disabled={isUploading}
                >
                    {agreement
                        ? "Replace"
                        : "Upload"}
                </Button>

                {/* ============================================================
                    Delete Agreement
                ============================================================= */}
                {agreement && (
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={onDelete}
                        disabled={
                            isUploading
                        }
                    >
                        Delete
                    </Button>
                )}

                {/* ============================================================
                    Delete Tenant
                ============================================================= */}
                <Tooltip title="Delete tenant">
                    <span>
                        <IconButton
                            size="small"
                            color="error"
                            aria-label="Delete tenant"
                            onClick={onDeleteTenant}
                            disabled={isUploading}
                        >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </>
    );
};

export default TenantRowActions;
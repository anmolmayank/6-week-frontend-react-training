/**
 * ============================================================================
 * Tenant Table Row
 * ============================================================================
 *
 * Purpose
 * -------
 * Renders a single tenant inside the Tenant table.
 *
 * Responsibilities
 * ----------------
 * - Display tenant information.
 * - Display rental agreement status.
 * - Display row actions.
 *
 * ============================================================================
 */

import {
    Chip,
    Link,
    Stack,
    TableCell,
    TableRow,
} from "@mui/material";

import type { Tenant } from "../models";
import TenantRowActions from "./TenantRowActions";

/**
 * ============================================================================
 * Component Props
 * ============================================================================
 */
export interface TenantTableRowProps {
    /**
     * Tenant record.
     */
    tenant: Tenant;

    /**
     * Indicates whether an upload is in progress.
     */
    isUploading: boolean;

    /**
     * Edit tenant.
     */
    onEdit: () => void;

    /**
     * Upload agreement.
     */
    onUpload: (file: File) => void;

    /**
     * Replace agreement.
     */
    onReplace: (file: File) => void;

    /**
     * Delete agreement.
     */
    onDelete: () => void;

    /**
     * Delete the tenant record.
     */
    onDeleteTenant: () => void;

    /**
     * Download agreement.
     */
    onDownload: () => void;
}

/**
 * ============================================================================
 * Tenant Table Row
 * ============================================================================
 */
const TenantTableRow = ({
    tenant,
    isUploading,
    onEdit,
    onUpload,
    onReplace,
    onDelete,
    onDeleteTenant,
    onDownload,
}: TenantTableRowProps) => {
    return (
        <TableRow hover>
            <TableCell>
                {tenant.tenantName}
            </TableCell>

            <TableCell>
                {tenant.apartmentNumber}
            </TableCell>

            <TableCell align="right">
                ₹{" "}
                {tenant.monthlyRent.toLocaleString(
                    "en-IN",
                )}
            </TableCell>

            <TableCell>
                <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
                    <Chip
                        size="small"
                        label={tenant.rentalAgreement ? "Uploaded" : "Not uploaded"}
                        sx={{
                            height: 23,
                            fontSize: 10.5,
                            fontWeight: 700,
                            bgcolor: tenant.rentalAgreement ? "#E5F7ED" : "#FFF2DD",
                            color: tenant.rentalAgreement ? "#16734C" : "#96610F",
                        }}
                    />
                    {tenant.rentalAgreement && (
                        <Link component="button" underline="hover" onClick={onDownload} sx={{ fontSize: 11.5 }}>
                            Download file
                        </Link>
                    )}
                </Stack>
            </TableCell>

            <TableCell align="center">
                <TenantRowActions
                    agreement={
                        tenant.rentalAgreement ??
                        null
                    }
                    isUploading={isUploading}
                    onEdit={onEdit}
                    onUpload={onUpload}
                    onReplace={onReplace}
                    onDelete={onDelete}
                    onDeleteTenant={onDeleteTenant}
                />
            </TableCell>
        </TableRow>
    );
};

export default TenantTableRow;
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
    Link,
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
                {tenant.rentalAgreement ? (
                    <Link
                        component="button"
                        underline="hover"
                        onClick={onDownload}
                    >
                        Download
                    </Link>
                ) : (
                    "Not Uploaded"
                )}
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
                />
            </TableCell>
        </TableRow>
    );
};

export default TenantTableRow;
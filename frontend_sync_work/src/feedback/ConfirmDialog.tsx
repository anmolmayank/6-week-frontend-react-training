/**
 * ============================================================================
 * File: ConfirmDialog.tsx
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides a reusable confirmation dialog for destructive or important
 * user actions.
 *
 * Examples
 * --------
 * - Delete tenant
 * - Delete rental agreement
 * - Delete user
 * - Remove property
 *
 * ============================================================================
 */

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

import type { ReactNode } from "react";

/**
 * ============================================================================
 * Types
 * ============================================================================
 */

interface ConfirmDialogProps {
    /**
     * Controls whether the dialog is visible.
     */
    open: boolean;

    /**
     * Dialog title.
     */
    title: string;

    /**
     * Confirmation message.
     */
    message: ReactNode;

    /**
     * Text displayed on the confirmation button.
     *
     * Defaults to "Confirm".
     */
    confirmText?: string;

    /**
     * Text displayed on the cancel button.
     *
     * Defaults to "Cancel".
     */
    cancelText?: string;

    /**
     * Whether the confirmation action is currently processing.
     */
    loading?: boolean;

    /**
     * Called when the user confirms the action.
     */
    onConfirm: () => void;

    /**
     * Called when the user cancels or closes the dialog.
     */
    onCancel: () => void;
}

/**
 * ============================================================================
 * Component
 * ============================================================================
 */

/**
 * Reusable confirmation dialog.
 */
export const ConfirmDialog = ({
    open,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCancel}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onCancel}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <Button
                    onClick={onConfirm}
                    disabled={loading}
                    variant="contained"
                    color="error"
                >
                    {loading
                        ? "Processing..."
                        : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
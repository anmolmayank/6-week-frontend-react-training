
/**
 * ============================================================================
 * Floating AI Chat Widget
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides a globally available floating AI assistant for authenticated users.
 *
 * Responsibilities
 * ----------------
 * - Display the launcher only when an access token exists.
 * - Open and minimize the responsive chat panel.
 * - Preserve the conversation while the panel is minimized.
 * - Hide the widget when the authentication session is cleared.
 * - Adapt the panel layout to desktop and mobile viewports.
 *
 * Learning Notes
 * --------------
 * useSyncExternalStore synchronizes React with the authentication session
 * utility. Token presence alone does not guarantee server-side authorization.
 *
 * The chat panel remains mounted while minimized so that ChatPage retains
 * its local state. Clearing the authentication session unmounts the widget.
 *
 * ============================================================================
 */

import { useId, useState, useSyncExternalStore } from "react";

import {
  Box,
  Fab,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MinimizeOutlinedIcon from "@mui/icons-material/MinimizeOutlined";

import {
  hasAccessToken,
  subscribeToAuthSession,
} from "@/features/auth/utils/authSession";

import ChatPage from "./ChatPage";

/**
 * ============================================================================
 * Floating AI Chat Widget
 * ============================================================================
 */
export function ChatWidget() {
  /**
   * ------------------------------------------------------------------------
   * Authentication Session
   * ------------------------------------------------------------------------
   *
   * Subscribe to authentication changes so the widget updates immediately
   * when the application logs in or clears the local session.
   */
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthSession,
    hasAccessToken,
    () => false,
  );

  /**
   * ------------------------------------------------------------------------
   * Widget State
   * ------------------------------------------------------------------------
   */
  const [isOpen, setIsOpen] = useState(false);

  /** Stable accessible ID for the chat dialog heading. */
  const dialogTitleId = useId();

  /**
   * ------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------
   */

  // Hide the launcher and panel when the user is unauthenticated.
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* ==================================================================
          Expanded Chat Panel
          ================================================================== */}

      {/*
       * Keep the panel mounted when minimized. Using display: none hides
       * the panel without unmounting ChatPage or losing its local state.
       */}
      <Paper
        role="dialog"
        aria-labelledby={dialogTitleId}
        aria-hidden={!isOpen}
        elevation={8}
        sx={{
          position: "fixed",
          zIndex: (theme) => theme.zIndex.modal - 1,
          right: {
            xs: 0,
            sm: 24,
          },
          bottom: {
            xs: 0,
            sm: 92,
          },
          width: {
            xs: "100vw",
            sm: "min(400px, calc(100vw - 48px))",
          },
          height: {
            xs: "100dvh",
            sm: "min(600px, calc(100dvh - 120px))",
          },
          maxHeight: "100dvh",
          minHeight: 0,
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: {
            xs: 0,
            sm: 3,
          },
        }}
      >
        {/* --------------------------------------------------------------
            Panel Header
            -------------------------------------------------------------- */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: 2,
            py: 1,
            flexShrink: 0,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 0,
            }}
          >
            <SmartToyOutlinedIcon color="primary" />

            <Typography
              id={dialogTitleId}
              variant="subtitle1"
              sx={{ fontWeight: 600 }}
              noWrap
            >
              AI Assistant
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexShrink: 0 }}>
            <Tooltip title="Minimize chat">
              <IconButton
                aria-label="Minimize chat"
                onClick={() => setIsOpen(false)}
                size="small"
                tabIndex={isOpen ? 0 : -1}
              >
                <MinimizeOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Close chat">
              <IconButton
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
                size="small"
                tabIndex={isOpen ? 0 : -1}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* --------------------------------------------------------------
            Conversation
            -------------------------------------------------------------- */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatPage compact />
        </Box>
      </Paper>

      {/* ==================================================================
          Floating Launcher
          ================================================================== */}
      {!isOpen && (
        <Tooltip title="Chat with AI">
          <Fab
            color="primary"
            aria-label="Open AI assistant"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={dialogTitleId}
            onClick={() => setIsOpen(true)}
            sx={{
              position: "fixed",
              right: {
                xs: 16,
                sm: 24,
              },
              bottom: {
                xs: 16,
                sm: 24,
              },
              zIndex: (theme) => theme.zIndex.modal,
              width: 60,
              height: 60,
            }}
          >
            <SmartToyOutlinedIcon fontSize="large" />
          </Fab>
        </Tooltip>
      )}
    </>
  );
}

export default ChatWidget;

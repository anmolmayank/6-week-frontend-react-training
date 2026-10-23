
/**
 * ============================================================================
 * Chat Page
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides the conversation interface for the local AI chatbot.
 *
 * Responsibilities
 * ----------------
 * - Display conversation history.
 * - Submit messages through RTK Query.
 * - Optimistically display user messages during submission.
 * - Show loading and error states.
 * - Validate user input.
 * - Support standalone and floating-widget layouts.
 *
 * Learning Notes
 * --------------
 * - useOptimistic provides immediate feedback while a request is pending.
 * - startTransition coordinates the optimistic submission flow.
 * - RTK Query manages the API request lifecycle.
 * - The conversation is stored locally in component state.
 *
 * Architecture
 * ------------
 * React 19 → RTK Query → Node.js → FastAPI → Ollama
 *
 * ============================================================================
 */

import {
  startTransition,
  useOptimistic,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { useSendChatMessageMutation } from "../api";

/**
 * ============================================================================
 * Constants
 * ============================================================================
 */

/** Maximum message length accepted by the backend. */
const MAX_MESSAGE_LENGTH = 2000;

/**
 * ============================================================================
 * Types
 * ============================================================================
 */

/**
 * Represents one message in the conversation.
 */
interface ChatMessage {
  /** Unique identifier for React rendering. */
  id: string;

  /** Identifies the sender of the message. */
  role: "user" | "assistant";

  /** Message content. */
  content: string;
}


/**
 * ============================================================================
 * Chat Page Props
 * ============================================================================
 */
interface ChatPageProps {
  /**
   * Enables a flexible layout when rendered inside the floating AI chat widget.
   *
   * When enabled:
   * - The component fills the available container height.
   * - The standalone header is hidden.
   * - The outer card has no additional shadow or rounded corners.
   */
  readonly compact?: boolean;
}

/**
 * ============================================================================
 * Error Utilities
 * ============================================================================
 */

/**
 * Extracts a readable message from an RTK Query error.
 *
 * Falls back to a general error message when the response does not contain
 * a usable message.
 */
function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;

    if (typeof data === "object" && data !== null && "message" in data) {
      if (typeof data.message === "string") {
        return data.message;
      }
    }
  }

  return (
    "Unable to generate a response. Please check that the backend " +
    "and Ollama are running, then try again."
  );
}

/**
 * ============================================================================
 * Local AI Chat Page
 * ============================================================================
 */
export default function ChatPage({
  compact = false,
}: ChatPageProps) {
  /**
   * ------------------------------------------------------------------------
   * Input State
   * ------------------------------------------------------------------------
   */

  /** Current message entered by the user. */
  const [input, setInput] = useState("");

  /**
   * ------------------------------------------------------------------------
   * Conversation State
   * ------------------------------------------------------------------------
   */

  /** Confirmed conversation history for the current component session. */
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your local AI assistant. What would you like to know?",
    },
  ]);

  /**
   * ------------------------------------------------------------------------
   * React 19: Optimistic Conversation
   * ------------------------------------------------------------------------
   *
   * The optimistic message appears immediately while the request is pending.
   * The confirmed messages state remains the source of truth.
   */
  const [displayMessages, addOptimisticMessage] = useOptimistic<
    ChatMessage[],
    ChatMessage
  >(messages, (currentMessages, optimisticMessage) => [
    ...currentMessages,
    optimisticMessage,
  ]);

  /**
   * ------------------------------------------------------------------------
   * Error State
   * ------------------------------------------------------------------------
   */

  /** Error displayed when a request fails. */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * ------------------------------------------------------------------------
   * API State
   * ------------------------------------------------------------------------
   */

  /** RTK Query mutation for the Node.js chat endpoint. */
  const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();

  /**
   * ------------------------------------------------------------------------
   * Submit Message
   * ------------------------------------------------------------------------
   *
   * Validates the input, clears the composer, and starts the API request.
   * The optimistic user message is shown while the asynchronous action runs.
   */
  const submitMessage = (): void => {
    const message = input.trim();

    // Ignore empty messages and duplicate submissions.
    if (!message || isLoading) {
      return;
    }

    // Validate the message before sending the request.
    if (message.length > MAX_MESSAGE_LENGTH) {
      setErrorMessage(
        `Your message must not exceed ${MAX_MESSAGE_LENGTH} characters.`,
      );
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    // Clear the composer and any previous error.
    setInput("");
    setErrorMessage(null);

    /**
     * React 19: Async Transition
     *
     * The optimistic update remains active while the asynchronous action
     * is pending. The confirmed conversation is updated when the request
     * succeeds or fails.
     */
    startTransition(async () => {
      addOptimisticMessage(userMessage);

      try {
        // Send the request through the existing RTK Query endpoint.
        const response = await sendChatMessage({ message }).unwrap();

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.data.message,
        };

        // Commit the user message and AI response to confirmed history.
        setMessages((previousMessages) => [
          ...previousMessages,
          userMessage,
          assistantMessage,
        ]);
      } catch (error: unknown) {
        /**
         * Preserve the submitted user message even when the request fails.
         * This avoids losing the user's input after an API error.
         */
        setMessages((previousMessages) => [
          ...previousMessages,
          userMessage,
        ]);

        setErrorMessage(getErrorMessage(error));
      }
    });
  };

  /**
   * ------------------------------------------------------------------------
   * Form Submission
   * ------------------------------------------------------------------------
   *
   * Uses the inferred form event type rather than explicitly referencing
   * the deprecated FormEvent type.
   */
  const handleSubmit: NonNullable<
    ComponentProps<"form">["onSubmit"]
  > = (event) => {
    event.preventDefault();
    submitMessage();
  };

  /**
   * ------------------------------------------------------------------------
   * Keyboard Interaction
   * ------------------------------------------------------------------------
   *
   * Enter submits the message.
   * Shift + Enter inserts a newline.
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.closest("form")?.requestSubmit();
    }
  };

  /**
   * ==========================================================================
   * Render
   * ==========================================================================
   */
  return (
    <Paper
      elevation={compact ? 0 : 2}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: compact ? "none" : 1000,
        height: compact ? "100%" : "min(80vh, 800px)",
        minHeight: 0,
        flex: compact ? 1 : "initial",
        mx: compact ? 0 : "auto",
        overflow: "hidden",
        borderRadius: compact ? 0 : 3,
        boxShadow: compact ? "none" : undefined,
      }}
    >
      {/* ==================================================================
          Standalone Chat Header
          ================================================================== */}
      {!compact && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <SmartToyOutlinedIcon />
          </Avatar>

          <Box>
            <Typography variant="h6">AI Assistant</Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Powered by your local Ollama model
            </Typography>
          </Box>
        </Box>
      )}

      {/* ==================================================================
          Conversation History
          ================================================================== */}
      <Box
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          p: { xs: 2, sm: 3 },
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {displayMessages.map((message) => {
            const isUser = message.role === "user";

            return (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  gap: 1,
                }}
              >
                {/* Assistant Avatar */}
                {!isUser && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main",
                      flexShrink: 0,
                    }}
                  >
                    <SmartToyOutlinedIcon fontSize="small" />
                  </Avatar>
                )}

                {/* Message Bubble */}
                <Paper
                  elevation={0}
                  sx={{
                    maxWidth: "80%",
                    minWidth: 0,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: isUser ? "primary.main" : "background.paper",
                    color: isUser
                      ? "primary.contrastText"
                      : "text.primary",
                    overflowWrap: "anywhere",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap" }}
                  >
                    {message.content}
                  </Typography>
                </Paper>

                {/* User Avatar */}
                {isUser && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "secondary.main",
                      flexShrink: 0,
                    }}
                  >
                    <PersonOutlineOutlinedIcon fontSize="small" />
                  </Avatar>
                )}
              </Box>
            );
          })}

          {/* ==============================================================
              Loading Indicator
              ============================================================== */}
          {isLoading && (
            <Box
              role="status"
              aria-label="AI is generating a response"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress size={20} />

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Generating response…
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* ==================================================================
          Request Error Feedback
          ================================================================== */}
      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage(null)}
          sx={{
            mx: 2,
            mt: 1,
            flexShrink: 0,
          }}
        >
          {errorMessage}
        </Alert>
      )}

      {/* ==================================================================
          Message Composer
          ================================================================== */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          flexShrink: 0,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            label="Ask your AI assistant"
            placeholder="Type a message…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            slotProps={{
              htmlInput: {
                maxLength: MAX_MESSAGE_LENGTH,
              },
            }}
            helperText={`${input.length}/${MAX_MESSAGE_LENGTH} characters · Enter to send`}
          />

          <Button
            type="submit"
            variant="contained"
            aria-label="Send message"
            disabled={isLoading || !input.trim()}
            sx={{
              minWidth: 48,
              width: 48,
              height: 48,
              flexShrink: 0,
              mb: 3,
            }}
          >
            {isLoading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              <SendOutlinedIcon />
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

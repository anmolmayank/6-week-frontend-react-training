
/**
 * ============================================================================
 * Chat API Endpoints
 * ============================================================================
 *
 * Purpose
 * -------
 * Registers endpoints for the local AI chatbot.
 *
 * Responsibilities
 * ----------------
 * - Send user messages to the Node.js chat API.
 * - Return the generated AI response.
 *
 * Architecture
 * ------------
 * React → RTK Query → Node.js → FastAPI → Ollama
 *
 * ============================================================================
 */

import { baseApi } from "@/app/api/baseApi";

import type {
  ChatRequest,
  ChatResponse,
} from "../models";

/**
 * ============================================================================
 * Chat Endpoints
 * ============================================================================
 */
export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * --------------------------------------------------------------
     * Send Chat Message
     * --------------------------------------------------------------
     *
     * Sends the user's message to the backend and returns the
     * generated response from the configured local language model.
     */
    sendChatMessage: builder.mutation<ChatResponse, ChatRequest>({
      query: (body) => ({
        url: "/chat",
        method: "POST",
        body,
      }),
    }),
  }),
});

/**
 * ============================================================================
 * RTK Query Hooks
 * ============================================================================
 */
export const { useSendChatMessageMutation } = chatApi;

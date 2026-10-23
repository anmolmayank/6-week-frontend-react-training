
/**
 * ============================================================================
 * Chat Models
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines request and response models for the AI Chat feature.
 *
 * ============================================================================
 */

/**
 * Request payload accepted by the Node.js chat API.
 */
export interface ChatRequest {
  /** User's message; the backend accepts 1–2000 characters. */
  message: string;
}

/**
 * Chat result returned by the FastAPI microservice through Node.js.
 */
export interface ChatResult {
  /** Generated response from the local language model. */
  message: string;

  /** AI provider identifier, currently "ollama". */
  provider: string;
}

/**
 * Standard API envelope returned by the Node.js backend.
 */
export interface ChatResponse {
  success: boolean;
  message: string;
  data: ChatResult;
  meta: Record<string, unknown>;
}

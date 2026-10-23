# React AI Chatbot Integration

## 1. Overview

This document describes the React-side integration for the local AI chatbot in the Fullstack Training application. It records the architecture, intended component responsibilities, API integration, authentication visibility, state handling, and verification steps discussed during implementation.

The chatbot uses the existing React application and its existing RTK Query API layer. The React app does **not** call Ollama or the Python service directly. It sends chat requests to the Node.js API, which forwards the request to the FastAPI AI microservice, which communicates with the locally running Ollama model.

### Goals

- Add an AI chatbot without replacing the existing application architecture.
- Reuse the existing RTK Query `baseApi`, API base URL, and bearer-token handling.
- Provide a floating AI entry point in the bottom-right corner.
- Show the chat interface only when an access token is present.
- Keep the conversation mounted while the widget is minimized, so its local conversation state is not lost when the panel is hidden.
- Use React 19 features where they help with the user experience, without making the implementation unnecessarily complex.

## 2. Architecture and request flow

```text
React application
  └── ChatWidget
       └── ChatPage
            └── useSendChatMessageMutation (RTK Query)
                 └── Node.js API
                      POST /api/v1/chat
                       └── FastAPI AI microservice
                            └── Ollama
                                 └── Local model (qwen3:1.7b)
```

### Responsibilities by layer

| Layer | Responsibility |
|---|---|
| `ChatWidget` | Floating launcher, panel visibility, responsive widget layout, and authentication-aware visibility |
| `ChatPage` | Message presentation, composing a message, submitting it, loading/error feedback, and rendering the conversation |
| RTK Query chat endpoint | Sends the request through the existing API client and exposes mutation/loading/error state |
| `baseApi` | Supplies the configured Node API base URL and attaches the stored access token |
| Node.js API | Receives `POST /api/v1/chat` and coordinates with the AI service |
| FastAPI microservice | Calls the configured local model provider |
| Ollama | Runs the local language model |

## 3. Frontend technology and conventions

The frontend context recorded for this project includes:

- React 19
- TypeScript
- Vite
- Material UI
- Redux Toolkit and RTK Query
- React Router
- An existing shared `baseApi` configured with `VITE_API_BASE_URL`
- An existing access-token storage key exposed through `STORAGE_KEYS.ACCESS_TOKEN`

The integration is designed to extend the existing app rather than create a separate HTTP client or a second Redux store.

## 4. Suggested feature structure

The chat feature was organized around these files:

```text
src/
├── app/
│   └── api/
│       └── baseApi.ts
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.endpoints.ts
│   │   └── utils/
│   │       └── authSession.ts
│   └── chat/
│       ├── api/
│       │   ├── chat.endpoints.ts
│       │   └── index.ts
│       ├── models/
│       │   └── chat.models.ts
│       └── components/
│           ├── ChatPage.tsx
│           └── ChatWidget.tsx
├── routes/
│   ├── AppRoutes.tsx
│   └── ProtectedRoute.tsx
└── App.tsx
```

**Note:** This is the proposed/recorded organization from the implementation discussion. Confirm actual file locations in the repository before treating this tree as a definitive inventory.

## 5. RTK Query API integration

### Existing API client

The existing `src/app/api/baseApi.ts` was described as using `VITE_API_BASE_URL`, for example:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Its `prepareHeaders` callback reads `STORAGE_KEYS.ACCESS_TOKEN` and attaches the bearer token. Reusing `baseApi` keeps chat requests consistent with existing API calls.

Do not create a separate `fetch`/Axios client for chat unless there is a specific architectural requirement.

### Chat endpoint

The planned endpoint module is `src/features/chat/api/chat.endpoints.ts`. It injects a `sendChatMessage` mutation into the shared `baseApi` and exports the generated hook `useSendChatMessageMutation`.

The request method and path are:

```http
POST /chat
Content-Type: application/json
Authorization: Bearer <access-token>
```

Because the configured base URL includes `/api/v1`, the complete local Node endpoint is:

```text
http://localhost:3000/api/v1/chat
```

The exact request-body property names should match the Node chat route and its validation schema. Confirm the actual implementation before copying a request example into production documentation.

### Recorded response contract

The Node endpoint was observed in the project context to return a standardized response similar to:

```json
{
  "success": true,
  "message": "Chat response generated successfully",
  "data": {
    "message": "Generated answer",
    "provider": "ollama"
  },
  "meta": {}
}
```

The UI should read the generated text from `data.message`. The `provider` field indicates the selected provider; the recorded local provider is `ollama`.

## 6. Chat models and message state

The proposed model definitions live in `src/features/chat/models/chat.models.ts`.

The UI needs to distinguish at least:

- A user-authored message
- An assistant response
- The message text
- A stable message identifier for rendering
- Any status needed for optimistic/pending/error presentation

Use types that match the real API response. Do not assume conversation persistence or server-side conversation history unless it has been implemented explicitly. The recorded design keeps conversation state in the mounted React chat component.

## 7. Chat page responsibilities

`ChatPage.tsx` is the reusable conversation UI. It can be rendered as a standalone page or inside the floating widget.

A `compact?: boolean` prop was proposed to support both layouts:

- When `compact` is `true`, the page fills the widget's available height.
- The standalone page header is hidden.
- The outer card does not add its own shadow or rounded corners, because the widget panel provides that container styling.
- When `compact` is omitted or false, the page can use its regular standalone layout.

### Sending a message

The expected interaction is:

1. The user enters a message.
2. The UI validates that the message is not empty.
3. The user submits the message.
4. The user message is displayed immediately if optimistic UI is used.
5. The RTK Query mutation sends the request to the Node API.
6. On success, the assistant response is added to the conversation.
7. On failure, the UI presents an understandable error and lets the user retry.

React 19's `useOptimistic` and `startTransition` were proposed for responsive message submission. Keep optimistic state separate from confirmed API state as appropriate, and ensure a failed request does not leave a misleading permanent assistant response.

### Loading and errors

The chat UI should communicate that a request is in progress, prevent accidental duplicate submissions where appropriate, and display request failures without exposing internal stack traces, tokens, or service secrets.

## 8. Floating widget behavior

`ChatWidget.tsx` provides the floating entry point and panel.

### Launcher and panel

- The launcher is positioned at the bottom-right of the application.
- Selecting it opens the chat panel.
- Selecting the close/minimize control hides the panel.
- The panel should remain mounted while hidden.

**Important state-preservation detail:** do not conditionally unmount `ChatPage` when the panel closes. Render the panel continuously and toggle its visibility, for example with a display style that switches between `flex` and `none`. Conditional unmounting would reset component-local conversation state when the user minimizes the widget.

### Responsive behavior

- Desktop: a compact floating panel anchored to the bottom-right.
- Mobile: a near-full-screen panel to make the conversation usable on a narrow viewport.
- The panel should constrain its height and allow the message area to scroll, while keeping the input accessible.

Material UI primitives discussed for this implementation include `Paper` for the panel and `Fab` for the floating launcher. Keep the visual layout responsive and consistent with the application's theme.

### Accessibility considerations

- Give the panel a meaningful accessible label/title.
- Use a real button for launcher and close controls.
- Keep keyboard focus behavior predictable when opening and closing.
- Support Escape to close if appropriate for the chosen interaction.
- Ensure message text and controls have sufficient contrast and visible focus states.
- Do not rely only on color to communicate loading or errors.

## 9. Authentication-aware visibility

The intended behavior is to show the floating chatbot only when the user has an access token.

The recorded auth-session helper was:

```ts
import { STORAGE_KEYS } from "@/shared/constants";

const AUTH_SESSION_CHANGED = "app:auth-session-changed";

export function hasAccessToken(): boolean {
  return Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
}

export function notifyAuthSessionChanged(): void {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED));
}

export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  notifyAuthSessionChanged();
}

export function subscribeToAuthSession(
  callback: () => void,
): () => void {
  window.addEventListener(AUTH_SESSION_CHANGED, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGED, callback);
    window.removeEventListener("storage", callback);
  };
}
```

This pattern is intended to handle two cases:

- The same tab logs in or logs out, using the custom `app:auth-session-changed` event.
- Another tab changes local storage, using the browser `storage` event.

The auth login mutation should notify subscribers after storing the access token:

```ts
localStorage.setItem(
  STORAGE_KEYS.ACCESS_TOKEN,
  accessToken,
);

notifyAuthSessionChanged();
```

The logout flow should call `clearAuthSession()` or otherwise dispatch the same event after removing the token.

A React component can subscribe to the session using `useSyncExternalStore`, with `hasAccessToken` as the snapshot function and `subscribeToAuthSession` as the subscription function. The snapshot should remain a stable primitive value such as a boolean.

### Security boundary

Checking whether a token exists is only a frontend visibility rule. It does **not** prove that the token is valid, and it is not an authorization control. The Node API must continue validating the token and enforcing access on protected endpoints. Never expose secrets or the Ollama/FastAPI internal credentials in the frontend.

## 10. Mounting the widget in the application

The recorded integration plan is to mount the widget once, within the existing `BrowserRouter`, alongside the route tree in `src/App.tsx`.

Conceptually:

```tsx
<BrowserRouter>
  <AppRoutes />
  <ChatWidget />
</BrowserRouter>
```

Keep the application's existing `ThemeProvider`, `CssBaseline`, and other wrappers in their current positions. The widget should not be mounted separately on every route; a single app-level mount keeps it available as the user navigates.

The widget itself is responsible for deciding whether it should render based on the current authentication state.

## 11. Redux and API cache considerations

The recorded Redux store uses the existing `baseApi.reducer` and `baseApi.middleware`. Injecting the chat endpoint into `baseApi` means no separate chat reducer is required.

If the chat endpoint does not use RTK Query tags or cached query data, avoid adding unnecessary cache invalidation behavior. The chat mutation can use its returned data directly to update the conversation UI.

## 12. Local development prerequisites

The frontend talks to Node, not directly to the AI microservice.

The recorded local services are:

| Service | Local address |
|---|---|
| React/Vite | Use the frontend's configured Vite development URL |
| Node/Express | `http://localhost:3000` |
| FastAPI | `http://127.0.0.1:8001` |
| FastAPI Swagger UI | `http://127.0.0.1:8001/docs` |
| Ollama API | `http://127.0.0.1:11434` |

The configured Ollama model in the project context is `qwen3:1.7b`. A different model can be selected in the AI microservice configuration if it is installed and supported.

### Startup order

1. Start Ollama and confirm the configured model is available.
2. Start the FastAPI microservice.
3. Start the Node.js backend.
4. Start the React/Vite frontend.

FastAPI startup command recorded for this project:

```bash
cd ~/Desktop/Development/Fullstack/6-week-backend-node-training/ai-microservice
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Use the existing documented startup command for Node and the frontend rather than introducing new scripts without checking their respective `package.json` files.

## 13. Verification checklist

### Authentication and visibility

- [ ] Chat launcher is hidden when no access token is present.
- [ ] After login stores the token and dispatches the session event, the launcher becomes visible.
- [ ] After logout removes the token and dispatches the session event, the launcher becomes hidden.
- [ ] A token change in another tab is reflected where supported.
- [ ] The backend independently rejects missing or invalid authentication.

### Widget behavior

- [ ] Launcher is positioned at the bottom-right on desktop.
- [ ] The panel opens and closes correctly.
- [ ] Conversation state remains when the panel is minimized and reopened.
- [ ] Mobile layout occupies nearly the full screen.
- [ ] Message list scrolls independently of the input area.
- [ ] Keyboard users can operate the launcher, input, submit, and close controls.

### Chat request

- [ ] Empty messages are not submitted.
- [ ] A valid message calls `POST /api/v1/chat`.
- [ ] The access token is attached by the shared `baseApi`.
- [ ] Loading state is visible while the request is pending.
- [ ] The UI renders `data.message` from the successful response.
- [ ] A failed request produces a recoverable error state.
- [ ] Repeated submissions do not cause confusing duplicate UI messages.
- [ ] Browser network inspection confirms the request goes to Node, not directly to FastAPI or Ollama.

### Build and regression checks

- [ ] Run the frontend's configured production build command, normally `npm run build`.
- [ ] Resolve TypeScript errors and lint failures introduced by the chat integration.
- [ ] Test the existing login and tenant routes after mounting the widget.
- [ ] Confirm that existing RTK Query endpoints continue to work.
- [ ] Verify behavior at desktop and mobile viewport sizes.

## 14. Troubleshooting

| Symptom | Things to check |
|---|---|
| Launcher never appears after login | Confirm the token storage key, login success handler, and `notifyAuthSessionChanged()` call match. |
| Launcher remains after logout | Confirm logout removes the token and notifies subscribers. |
| Chat request returns 401 | Inspect the token in storage, the `baseApi` header setup, and Node authentication middleware. Do not paste tokens into logs or tickets. |
| Chat request fails with a network error | Confirm Node is running, `VITE_API_BASE_URL` is correct, and the browser's network panel shows the expected request URL. |
| Node returns a service error | Check Node-to-FastAPI connectivity and FastAPI logs. |
| FastAPI cannot generate a response | Check FastAPI logs, the Ollama service, model availability, and the configured model name. |
| Conversation disappears when minimized | Ensure `ChatPage` remains mounted and only the panel's visibility changes. |
| Swagger response differs from UI expectations | Confirm the UI reads the actual response shape, especially `data.message`. |
| Works locally but not after deployment | Review environment-specific API URLs, proxy/CORS configuration, service reachability, and secure deployment settings. |

## 15. Implementation notes and limitations

This document consolidates the implementation approach and file responsibilities recorded in the conversation. It is not a fresh inspection of the current frontend repository. In particular:

- The proposed chat file tree and auth-session helper should be checked against the current branch.
- The exact chat request-body schema should be confirmed from the current Node route and validation code.
- The recorded Node response shape should be checked against the current implementation if it has changed.
- The conversation described the widget integration plan and noted that a build had succeeded before the latest floating-widget changes; run the build again to verify the final state.
- The frontend's token-presence check controls visibility only; server-side authentication and authorization remain mandatory.
- No server-side conversation persistence, conversation history retrieval, streaming response behavior, or cancellation behavior is claimed here unless implemented separately.

## 16. Summary

The React chatbot integration extends the existing frontend with a reusable chat page and a floating widget. It uses the existing RTK Query client to call Node's `/api/v1/chat` endpoint, relies on the shared bearer-token setup, and routes AI generation through FastAPI and Ollama. The key implementation details are preserving the existing app architecture, keeping the chat mounted while minimized, handling same-tab login/logout notifications, maintaining responsive and accessible UI behavior, and verifying the complete request path end to end.

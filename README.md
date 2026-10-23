# 6-Week Full Stack Training — Frontend

An enterprise-oriented React frontend built as part of a structured **6-Week Full Stack Training Program**. The application demonstrates feature-based architecture, typed API integration, authentication, tenant management, rental-agreement file workflows, and a locally hosted AI chatbot.

The frontend is built with React, TypeScript, Vite, Redux Toolkit, RTK Query, React Hook Form, Zod, and Material UI. It integrates with the Node.js/Express backend for application APIs. AI chat requests travel through Node.js to a FastAPI microservice and then to Ollama; the browser does not call FastAPI or Ollama directly.

## Contents

- [Project goals](#project-goals)
- [Technology stack](#technology-stack)
- [Features](#features)
- [Architecture](#architecture)
- [AI chatbot integration](#ai-chatbot-integration)
- [Role-based dashboards](#role-based-dashboards-frozen-requirements)
- [Project structure](#project-structure)
- [Authentication flow](#authentication-flow)
- [Tenant and rental-agreement flow](#tenant-and-rental-agreement-flow)
- [Configuration](#configuration)
- [Local development](#local-development)
- [Validation, API handling, and state management](#validation-api-handling-and-state-management)
- [Quality checks](#quality-checks)
- [Known boundaries and follow-up work](#known-boundaries-and-follow-up-work)

## Project goals

- Apply modern React and TypeScript practices.
- Organize code by business feature and maintain clear separation of concerns.
- Build reusable, accessible UI components.
- Integrate REST APIs through a shared API client.
- Support authentication-aware API requests.
- Manage forms and validation consistently.
- Provide tenant and rental-agreement workflows.
- Integrate a local AI chatbot into the existing application without bypassing the Node.js API.
- Use repeatable development, build, and lint workflows.

## Technology stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based UI |
| TypeScript | Static typing |
| Vite | Development server and production build |
| Redux Toolkit | Application-level state infrastructure |
| RTK Query | API requests, mutation state, and cache management |
| React Router | Client-side routing |
| Material UI | UI components and theming |
| React Hook Form | Form state management |
| Zod | Request/form validation schemas |
| Node.js and Express | Backend REST API |
| FastAPI and Python | AI microservice |
| Ollama | Local model runtime |
| Qwen 3 1.7B (`qwen3:1.7b`) | Recorded default local chat model |

The installed dependency versions in `package.json` and the lockfile are the source of truth for this repository.

## Features

### Authentication

- Login form and request integration.
- Access-token persistence in browser storage.
- Bearer-token attachment through the shared API client.
- Client-side form validation and API error handling.
- Authentication-aware visibility for the AI chatbot launcher.

> The chatbot's token-presence check controls frontend visibility only. The backend remains responsible for validating tokens and authorizing API requests.

### User registration

- Registration flow and request integration, as listed in the existing project scope.
- Client-side validation and backend validation.
- Success and error handling.

Verify the current route and endpoint definitions in the repository when changing this section.

### Tenant management

- Tenant listing.
- Create-tenant form/dialog.
- Loading, error, and empty states.
- RTK Query cache refresh/invalidation after supported mutations.
- Edit existing tenant details through the current update dialog and backend PATCH integration.

### Rental agreement management

- Upload a rental agreement using `multipart/form-data`.
- Download an agreement through the browser.
- Delete an agreement.
- Refresh the affected tenant data after supported operations.

The backend upload middleware expects the multipart field named `agreement`; the backend also applies its configured file restrictions and size limit.

### AI chatbot

- Floating launcher anchored at the bottom-right of the application.
- Chat panel that opens and can be minimized/closed.
- Responsive layout designed for desktop and near-full-screen mobile use.
- Chat messages sent through the existing RTK Query `baseApi`.
- Bearer token attached by the shared API client.
- Loading and error state handling.
- Authentication-aware launcher visibility.
- Chat UI kept mounted while minimized so local conversation state is retained while the panel is hidden.

The chatbot uses a locally hosted model through the application backend; it does not call a third-party hosted LLM API directly from the browser.

## Architecture

### Frontend and API flow

```text
Browser
  |
  v
React Router
  |
  v
Feature pages and components
  |
  +-------------------+----------------------+
  |                   |                      |
  v                   v                      v
React Hook Form    Local UI state       Shared components
  |
  v
Zod validation
  |
  v
RTK Query endpoints
  |
  v
Shared baseApi
  |
  | HTTP + Authorization: Bearer <token>
  v
Node.js / Express API
  |
  +-----------------------------+
  |                             |
  v                             v
Tenant/auth/file services       AI chat route
  |                             |
  v                             v
MongoDB                     FastAPI microservice
                                |
                                v
                              Ollama
                                |
                                v
                         Local language model
```

### Responsibilities

| Layer | Responsibility |
|---|---|
| Pages | Compose feature-level screens |
| Components | Render reusable and feature-specific UI |
| Validation | Validate user input before API submission |
| RTK Query | Execute API calls and manage request/cache state |
| `baseApi` | Central API base URL and bearer-token header behavior |
| Models | Shared TypeScript types for request and response data |
| Shared utilities | Common constants, hooks, and helper functions |
| Node.js backend | Authentication and application API orchestration |
| FastAPI service | Local AI integration |
| Ollama | Executes the local model |

## AI chatbot integration

### End-to-end request flow

1. The authenticated user opens the floating chat widget.
2. The user enters a message in the chat interface.
3. The React chat feature calls the RTK Query `sendChatMessage` mutation.
4. The shared `baseApi` sends the request to Node.js and attaches the stored access token.
5. Node handles `POST /api/v1/chat` and forwards the AI request to FastAPI.
6. FastAPI calls the configured Ollama model.
7. The response travels back through FastAPI and Node to React.
8. The chat UI renders the generated response.

```text
ChatWidget / ChatPage
    |
    v
useSendChatMessageMutation
    |
    v
POST /api/v1/chat (Node.js)
    |
    v
FastAPI :8001
    |
    v
Ollama :11434
    |
    v
Model response
    |
    v
React chat conversation
```

### Frontend integration points

The integration discussed for this project uses the following responsibilities and file names. Confirm the current branch's exact file locations before relying on this as a complete file inventory.

| File or module | Responsibility |
|---|---|
| `src/app/api/baseApi.ts` | Shared API configuration and bearer-token header |
| `src/features/chat/api/chat.endpoints.ts` | RTK Query chat mutation injected into `baseApi` |
| `src/features/chat/api/index.ts` | Chat API exports and generated hook export |
| `src/features/chat/models/chat.models.ts` | Chat request/response and message types |
| `src/features/chat/components/ChatPage.tsx` | Conversation UI, message composition, request state, and response rendering |
| `src/features/chat/components/ChatWidget.tsx` | Floating launcher, panel visibility, responsive layout, and authentication-aware display |
| `src/features/auth/utils/authSession.ts` | Shared auth-session status and change notifications, if present in the branch |
| `src/App.tsx` | App-level mounting point for the widget |

### Chat API

The shared API base URL includes `/api/v1`, so the chat endpoint's relative path is `/chat`.

```http
POST http://localhost:3000/api/v1/chat
Content-Type: application/json
Authorization: Bearer <access-token>
```

The body must match the Node route's actual validation schema. Confirm the current route and schema before using a payload example; this README intentionally does not guess the request property names.

The response observed in the project context follows this shape:

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

The UI should render the generated answer from `data.message` when this response contract remains unchanged. The `provider` value in the recorded local setup is `ollama`.

### Authentication-aware widget visibility

The integration plan checks for the access token stored under `STORAGE_KEYS.ACCESS_TOKEN` and subscribes to session changes so the launcher can respond to login/logout in the same tab.

The discussed approach is:

- Store the access token after successful login.
- Notify the auth-session subscribers after the token is stored.
- Remove the token on logout and notify subscribers again.
- Use `useSyncExternalStore` or an equivalent subscription mechanism to keep the widget visibility synchronized.
- Keep backend token validation and authorization as the real security boundary.

If `authSession.ts` is not yet present in the active branch, add it consistently with the existing auth module before documenting it as a completed file.

### Panel and conversation state

- Mount the widget once at the application level rather than separately on each page.
- Keep `ChatPage` mounted while the panel is minimized; change visibility instead of conditionally unmounting the chat page.
- This preserves component-local conversation state when the user hides and reopens the panel.
- Do not describe that state as persisted across browser reloads unless session/history persistence has been implemented separately.
- Use an accessible panel title, keyboard-operable controls, visible focus states, and responsive sizing.

React 19's `useOptimistic` and `startTransition` were discussed as options for responsive message submission. Use them only where they match the actual implementation, and ensure failed requests do not leave misleading messages in the conversation.

### Local service addresses

| Service | Local address |
|---|---|
| Node.js API | `http://localhost:3000` |
| FastAPI AI service | `http://127.0.0.1:8001` |
| FastAPI Swagger UI | `http://127.0.0.1:8001/docs` |
| Ollama API | `http://127.0.0.1:11434` |

The AI service and model are local development dependencies. A deployed frontend must use the correct deployed Node API URL; it should not expose or directly call internal FastAPI/Ollama endpoints from the browser.

For the detailed implementation notes and verification checklist, keep the companion document at `docs/REACT_AI_CHATBOT_INTEGRATION.md`.

## Project structure

The structure below reflects the project organization described in the existing README plus the chat feature organization discussed during integration. Confirm filenames against the active branch.

```text
src/
├── app/
│   ├── api/
│   ├── routes/
│   ├── store/
│   └── providers/
├── features/
│   ├── auth/
│   │   ├── api/
│   │   └── utils/
│   ├── chat/
│   │   ├── api/
│   │   ├── components/
│   │   └── models/
│   ├── tenant/
│   └── user/
├── shared/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── models/
│   ├── utils/
│   └── validation/
├── routes/
├── App.tsx
└── main.tsx
```

A feature may use folders such as `api`, `components`, `models`, `pages`, `validation`, and an `index.ts` barrel where appropriate. Avoid creating empty folders solely to match the diagram; structure features around their actual code.

## Authentication flow

```text
User submits login form
        |
        v
React Hook Form + Zod
        |
        v
RTK Query login mutation
        |
        v
POST /auth/login
        |
        v
Node returns access token
        |
        v
Frontend stores access token
        |
        +------------------------------+
        |                              |
        v                              v
baseApi attaches bearer token   Auth-session notification
        |                              |
        v                              v
Protected API calls             Chat launcher visibility
```

The actual authorization decision remains on the backend. A token's presence in local storage must not be treated as proof that it is valid.

## Tenant and rental-agreement flow

```text
Tenant page
    |
    v
RTK Query tenant endpoints
    |
    +--> GET /tenants
    |
    +--> POST /tenants
    |
    +--> PATCH /tenants/:tenantId
    |
    +--> POST /tenants/:tenantId/agreement
    |
    +--> GET /tenants/:tenantId/agreement
    |
    +--> DELETE /tenants/:tenantId/agreement
    |
    v
Cache invalidation/refetch where configured
    |
    v
Updated tenant UI
```

The available operations should be verified against the backend routes and frontend endpoint definitions. The diagram represents the backend tenant routes discussed in this project.

## Configuration

Create a local environment file such as `.env.local` at the frontend project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Vite exposes variables prefixed with `VITE_` to client-side code. **Never put passwords, private API keys, MongoDB credentials, or other secrets in frontend environment variables.** Anything bundled into the frontend can be inspected by users.

Make sure the configured base URL includes `/api/v1` because feature endpoint paths such as `/auth/login`, `/tenants`, and `/chat` are relative to it.

## Local development

### Prerequisites

- Node.js version compatible with the repository's `package.json` and lockfile.
- npm.
- The Node.js backend running on the configured API URL.
- For AI chat, the FastAPI service and Ollama model must also be running.

### Install dependencies

```bash
npm install
```

### Start the frontend

```bash
npm run dev
```

Vite prints the local development URL in the terminal.

### Build for production

```bash
npm run build
```

### Run linting

```bash
npm run lint
```

Use the scripts defined in the current `package.json` as the source of truth.

### Recommended local startup order for AI chat

1. Start Ollama and verify the configured model is available.
2. Start the FastAPI microservice.
3. Start the Node.js backend.
4. Start the React frontend.

The frontend should send chat requests to Node.js. If the chat fails, inspect the browser Network tab first, then check Node, FastAPI, and Ollama logs in sequence.

## Validation, API handling, and state management

### Shared API client

The shared `baseApi` is intended to centralize:

- API base URL.
- Authorization header preparation.
- Shared RTK Query configuration.
- Endpoint injection and cache behavior.

Chat should reuse this API layer rather than introducing an unrelated HTTP client.

### Form validation

Forms use React Hook Form and Zod where implemented. Frontend validation provides fast feedback, but backend validation and database constraints remain necessary.

### Standard API response

The existing README describes a standardized response format:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

Check each endpoint's real response schema when adding or changing TypeScript models; the chat response is an example with `data.message` and `data.provider`.

### Feature-based architecture

- Pages compose feature components.
- Components focus on UI and user interaction.
- API modules define server communication.
- Models hold shared request/response types.
- Validation schemas describe input constraints where used.
- Shared modules contain cross-feature constants and utilities.

## Quality checks

Before merging frontend changes:

- [ ] `npm run build` succeeds.
- [ ] `npm run lint` succeeds.
- [ ] Login and logout still work.
- [ ] Existing tenant and agreement workflows still work.
- [ ] Chat launcher appears and disappears appropriately when auth state changes.
- [ ] Chat requests go to `POST /api/v1/chat` through Node.
- [ ] Request loading and error states are understandable.
- [ ] Conversation state remains while the widget is minimized and reopened.
- [ ] Desktop and mobile layouts are checked.
- [ ] No secrets or access tokens are written to application logs.
- [ ] Backend authentication still rejects invalid or missing tokens.

## Known boundaries and follow-up work

The existing README lists the following areas for continued improvement. Update this section as the roadmap changes.

### User experience

- Shared/global snackbar notifications.
- Confirmation dialogs.
- Skeleton loading states.
- Consistent error presentation.

### Tenant module

- Delete tenant, if supported by the product/backend requirements.
- Search, filtering, pagination, and sorting.
- Review edit-tenant UI coverage against the implemented backend `PATCH` endpoint.

### Authentication

- Refresh-token strategy.
- Automatic logout/expired-session handling.
- Refresh-token strategy and automatic expired-session handling.

### Quality

- Unit and integration tests.
- Shared dialog and notification components.
- Consistent global error handling.
- Further accessibility and responsive-layout testing for the chatbot.

### AI chatbot

- Confirm all chat source files and behaviors against the active branch.
- Verify request/response types against the Node chat validation and response schemas.
- Test the complete Node → FastAPI → Ollama path.
- Add server-side conversation persistence or streaming only if required and implemented.
- Verify production environment configuration and service security before deployment.

## Learning outcomes

This frontend demonstrates the practical use of:

- React 19 and TypeScript.
- Vite development/build tooling.
- Material UI and reusable components.
- Redux Toolkit and RTK Query.
- React Hook Form and Zod.
- JWT-based API request integration.
- Feature-oriented frontend architecture.
- Tenant and file-workflow integration.
- Responsive AI chat UI integrated through a backend service.
- Local AI integration using Node.js, FastAPI, and Ollama.

---

**Documentation note:** This README consolidates the uploaded frontend README and the implementation details recorded in the conversation. It has not been verified against a live checkout of the current frontend branch. Confirm the file tree, chat request schema, response types, and implementation status before treating proposed paths or planned behavior as the definitive repository state.

## Role-based dashboards and Node API integration

The frontend now consumes the role-aware Node.js API. The authenticated role comes from the backend login response and is refreshed through `GET /api/v1/auth/me`; the frontend no longer assigns owner access to role-less sessions. Route guards improve navigation UX, while Node.js middleware must enforce all access rules.

### Owner workspace

- Overview metrics derived from tenant records and the maintenance-ticket API.
- Tenant listing, creation, editing, deletion, and agreement upload/replace/download/removal.
- Agreement coverage register.
- Owner maintenance-ticket inbox with full request details and status updates.
- User Accounts page to view registered accounts, assign `owner`/`tenant` role where authorized, and link tenant accounts to a tenant record.

### Tenant portal

- Read-only personal and tenancy details loaded from `GET /api/v1/tenants/me`.
- Read-only agreement metadata and download through `GET /api/v1/tenants/me/agreement`.
- Ticket submission through `POST /api/v1/maintenance-tickets`.
- Status tracking through `GET /api/v1/maintenance-tickets/mine`. The tenant UI displays status only; it does not display ticket IDs, subjects, descriptions, tenant information, or owner-only notes.
- Tenant pages never request the global tenant collection.

### Login and account linking

The current contracts are:

| Method | Endpoint | Purpose / access |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Sign in; response includes `data.accessToken` and `data.user` with `role` and `tenantId` |
| `GET` | `/api/v1/auth/me` | Refresh the authenticated identity and role |
| `POST` | `/api/v1/users` | Public registration; always creates an unlinked tenant account |
| `GET` | `/api/v1/users` | Owner-only user directory |
| `PATCH` | `/api/v1/users/:id` | Owner-only account update/role assignment/tenant linking |

A newly registered tenant account has no tenant association until an owner links it to a specific tenant record from **Owner → Users**. Before that link exists, tenant-scoped profile, agreement, and ticket APIs return an authorization error and the frontend explains the dependency. Public registration never lets a user assign their own owner role.

### Maintenance-ticket contract

| Method | Endpoint | Access / behavior |
|---|---|---|
| `POST` | `/api/v1/maintenance-tickets` | Linked tenant creates a ticket with `subject` and `description` |
| `GET` | `/api/v1/maintenance-tickets/mine` | Tenant receives only `{ ticketId, status }` records; UI renders status only |
| `GET` | `/api/v1/maintenance-tickets` | Owner receives full ticket details |
| `PATCH` | `/api/v1/maintenance-tickets/:ticketId/status` | Owner updates status to `open`, `in_progress`, `resolved`, or `closed` |

The owner UI uses the returned ticket collection to show descriptions and tenant/apartment details. The tenant UI consumes the status-only DTO and intentionally does not display identifiers or request details.

### Frontend route map

| Workspace | Route | Purpose |
|---|---|---|
| Owner | `/owner/dashboard` | Tenant/agreement summary and ticket counts |
| Owner | `/owner/tenants` | Tenant management and rental agreement actions |
| Owner | `/owner/agreements` | Agreement coverage register |
| Owner | `/owner/maintenance-tickets` | Full ticket review and status management |
| Owner | `/owner/users` | Account directory and tenant-account linking |
| Tenant | `/tenant/dashboard` | Personal tenancy summary |
| Tenant | `/tenant/my-details` | Read-only details |
| Tenant | `/tenant/my-agreement` | Read-only agreement access/download |
| Tenant | `/tenant/maintenance-tickets` | Status-only ticket tracking |
| Tenant | `/tenant/maintenance-tickets/new` | Submit a maintenance request |

### Security boundaries

- Node.js derives `role` and `tenantId` from the persisted user behind the access token, not from arbitrary request-body fields.
- Owner-only operations must use the backend owner-authorization middleware.
- Tenant self-service endpoints derive the tenant record from the authenticated account and never trust a client-supplied tenant ID.
- Tenant ticket responses are intentionally limited to ticket ID and status; the React UI renders status only.
- Agreement file paths and stored filenames must not be exposed through tenant-scoped profile responses.
- A client-side role guard or hidden navigation item is not a substitute for backend authorization.

The frontend integration files are organized around `src/features/auth/api`, `src/features/tenant/api`, `src/features/users/api`, and `src/features/maintenance/api`. See [`docs/NODE_ROLE_API_INTEGRATION.md`](docs/NODE_ROLE_API_INTEGRATION.md) for the integration mapping.


## Material UI v9 migration notes

This codebase uses Material UI v9. Style-system values for components such as `Box`, `Stack`, `Typography`, `Link`, and `Grid` must be provided through `sx` rather than legacy direct styling props. For example:

```tsx
// Material UI v9 style
<Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}>
    Section title
  </Typography>
</Stack>
```

For `TextField`, use the slot API for native input and input-component props:

- `InputProps` → `slotProps.input`
- `inputProps` → `slotProps.htmlInput`

See the [Material UI v9 migration guide](https://mui.com/material-ui/migration/upgrade-to-v9/) for details. Run `npm run build` and `npm run lint` after installing dependencies to verify the current branch.

## Tenant agreements and deletion workflows

The owner tenant form supports an optional PDF agreement during tenant creation. The workflow creates the tenant first, then uploads the selected file to `POST /api/v1/tenants/:tenantId/agreement` using the multipart field `agreement`. If the tenant is created but the upload fails, the dialog reports the partial success and closes to prevent an accidental duplicate tenant; the agreement can then be uploaded from the tenant row.

In edit mode, tenant details can be updated while replacing the existing agreement with a PDF or explicitly removing the current agreement. Existing table actions also support upload/replace, download, and agreement deletion. The frontend enforces a 10 MB file-size limit and PDF selection as a convenience; the backend must enforce these checks as well.

The tenant table includes a delete action and calls the owner-authorized `DELETE /api/v1/tenants/:tenantId` route. The current backend implementation removes the tenant record, unlinks the associated login account, attempts rental-agreement file cleanup, and retains ticket snapshots for audit. Check server logs and the backend cleanup policy if file deletion fails.


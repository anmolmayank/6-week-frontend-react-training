# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performance.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

# 6-Week Full Stack Training – Frontend

An enterprise-grade React frontend built as part of a structured **6-Week Full Stack Training Program**. The objective of this project is to learn and implement modern frontend development practices using React, TypeScript, Redux Toolkit, RTK Query, and scalable application architecture.

---

# Objectives

The primary goals of this training are to:

- Learn enterprise React development
- Understand scalable project architecture
- Build reusable UI components
- Integrate REST APIs
- Implement Authentication & Authorization
- Handle File Upload & Download
- Apply clean code principles
- Develop production-ready coding practices

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Development |
| TypeScript | Static Type Checking |
| Vite | Development & Build Tool |
| Redux Toolkit | State Management |
| RTK Query | Data Fetching & Caching |
| React Hook Form | Form Management |
| Zod | Schema Validation |
| Material UI | UI Component Library |
| React Router | Client-side Routing |

---

# Features Implemented

## Authentication Module

### Login

- JWT Authentication
- Token Persistence
- Form Validation
- Protected API Calls

### User Registration

- Create User
- Client-side Validation
- Backend Validation
- Error Handling

---

## Tenant Management Module

### Tenant Listing

- Display Tenant Records
- Loading State
- Error State
- Empty State

### Create Tenant

- Modal Dialog
- Form Validation
- Automatic Refresh

### Rental Agreement Management

#### Upload Agreement

- PDF Upload
- Multipart/FormData
- Replace Existing Agreement

#### Download Agreement

- Browser File Download

#### Delete Agreement

- Delete Agreement
- Automatic Refresh

---

# Project Structure

```text
src
│
├── app
│   ├── api
│   ├── routes
│   ├── store
│   └── providers
│
├── features
│   ├── auth
│   ├── tenant
│   └── user
│
├── shared
│   ├── components
│   ├── constants
│   ├── hooks
│   ├── models
│   ├── utils
│   └── validation
│
└── main.tsx
```

---

# Feature Folder Structure

Every feature follows a consistent architecture.

```text
feature
│
├── api
│
├── components
│
├── models
│
├── pages
│
├── validation
│
└── index.ts
```

This keeps each feature isolated, reusable, and independently scalable.

---

# Frontend Architecture

```text
                                    Browser
                                       │
                                       │
                                 React Router
                                       │
                                       ▼
                                Feature Pages
                                       │
                                       ▼
                             Feature Components
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
       React Hook Form          Local Component State      Reusable Components
              │
              ▼
       Zod Validation
              │
              ▼
          RTK Query
              │
              ▼
          Shared Base API
              │
              ▼
        Express REST API
              │
              ▼
          Service Layer
              │
              ▼
         Repository Layer
              │
              ▼
            MongoDB
```

---

# Authentication Flow

```text
User Login
     │
     ▼
Login Form
     │
     ▼
React Hook Form
     │
     ▼
Zod Validation
     │
     ▼
RTK Query
     │
     ▼
POST /auth/login
     │
     ▼
JWT Token
     │
     ▼
Local Storage
     │
     ▼
Authorization Header
     │
     ▼
Protected APIs
```

---

# Tenant Management Flow

```text
Open Tenant Page
        │
        ▼
GET /tenants
        │
        ▼
Tenant Table
        │
        ▼
User Actions
        │
 ┌──────┼───────────────┐
 │      │               │
 ▼      ▼               ▼
Create Upload       Download/Delete
 │      │               │
 ▼      ▼               ▼
POST   POST           GET / DELETE
 │      │               │
 └──────┴───────────────┘
        │
        ▼
RTK Query Cache Invalidation
        │
        ▼
GET /tenants
        │
        ▼
Updated UI
```

---

# Architectural Principles

The application follows enterprise development principles.

## Feature-Based Architecture

Business functionality is grouped by feature rather than by technical layer.

Example:

- Authentication
- Tenant
- User

---

## Separation of Concerns

| Layer | Responsibility |
|--------|----------------|
| Pages | Compose feature components |
| Components | UI Rendering |
| Validation | Input Validation |
| RTK Query | API Communication |
| Models | Shared Types |
| Shared | Common Utilities |

---

## API Layer

A shared `baseApi` provides:

- Common Base URL
- Authorization Header
- Shared Configuration
- Cache Invalidation
- RTK Query Integration

---

## Form Handling

All forms use:

- React Hook Form
- Zod
- TypeScript

Benefits:

- Strong typing
- Minimal re-renders
- Reusable validation
- Better developer experience

---

## Validation Strategy

Validation is performed at two levels.

Frontend

- Immediate feedback using Zod

Backend

- Request validation
- Database validation

---

## API Response Format

Every API follows the same response contract.

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

---

# Development Scripts

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build

```bash
npm run build
```

Lint

```bash
npm run lint
```

---

# Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

---

# Current Progress

## Week 1

- Project Setup
- React
- TypeScript
- Routing
- RTK Query
- Authentication

## Week 2

- Registration
- JWT Authentication
- Protected APIs
- API Integration

## Week 3

- Tenant Management
- CRUD Operations
- File Upload
- File Download
- File Deletion

---

# Planned Enhancements

## User Experience

- Global Snackbar Notifications
- Confirmation Dialogs
- Skeleton Loaders
- Better Error Handling

## Tenant Module

- Edit Tenant
- Delete Tenant
- Search
- Filtering
- Pagination
- Sorting

## Authentication

- Refresh Token
- Auto Logout
- Role-Based Access Control

## Quality

- Unit Testing
- Integration Testing
- Shared Dialog Components
- Shared Notification System
- Global Error Handler

---

# Learning Outcomes

This project demonstrates practical implementation of:

- React 19
- TypeScript
- Material UI
- Redux Toolkit
- RTK Query
- React Hook Form
- Zod
- JWT Authentication
- Protected Routes
- File Upload
- Feature-Based Architecture
- Clean Code Principles
- Enterprise Frontend Architecture


# 6-Week Full Stack Training — Frontend

An enterprise-oriented React frontend built as part of a structured **6-Week Full Stack Training Program**. The application demonstrates feature-based architecture, typed API integration, authentication, tenant management, rental-agreement file workflows, and a locally hosted AI chatbot.

The frontend is built with React, TypeScript, Vite, Redux Toolkit, RTK Query, React Hook Form, Zod, and Material UI. It integrates with the Node.js/Express backend for application APIs. AI chat requests travel through Node.js to a FastAPI microservice and then to Ollama; the browser does not call FastAPI or Ollama directly.

## Contents

- [Project goals](#project-goals)
- [Technology stack](#technology-stack)
- [Features](#features)
- [Architecture](#architecture)
- [AI chatbot integration](#ai-chatbot-integration)
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
- Tenant update support should be described as a frontend feature only once its UI is confirmed in the current branch.

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
- Role-based access control, if required.

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

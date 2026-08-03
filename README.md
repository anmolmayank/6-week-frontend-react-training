# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

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

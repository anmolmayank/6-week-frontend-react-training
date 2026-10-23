# Frontend integration with the role-aware Node.js API

This note maps the current React integration to the Node.js contracts discussed for owner/tenant roles, tenant self-service, user linking, rental agreements, and maintenance tickets.

## Authentication

- `POST /auth/login` returns the standard API envelope with `data.accessToken` and `data.user`.
- `data.user.role` is either `owner` or `tenant`; `data.user.tenantId` is the associated tenant record ID or `null`.
- `GET /auth/me` refreshes the UI-safe identity when restoring a stored session.
- `ProtectedRoute` waits for the backend identity and compares its returned role with the route's allowed roles.
- `baseApi` attaches the stored bearer token to all feature API calls.
- Role-less stored sessions no longer default to owner in the UI.

## Owner APIs

| Frontend feature | Endpoint |
|---|---|
| Tenant listing | `GET /tenants` |
| Create tenant | `POST /tenants` |
| Edit tenant | `PATCH /tenants/:tenantId` |
| Delete tenant | `DELETE /tenants/:tenantId` |
| Upload/replace agreement | `POST /tenants/:tenantId/agreement` (multipart field `agreement`) |
| Download agreement | `GET /tenants/:tenantId/agreement` |
| Remove agreement | `DELETE /tenants/:tenantId/agreement` |
| List user accounts | `GET /users` |
| Link/update user account | `PATCH /users/:id` |
| List all tickets | `GET /maintenance-tickets` |
| Update ticket status | `PATCH /maintenance-tickets/:ticketId/status` |

Owner account linking sends the persisted role and selected tenant ID. The Node service validates that the tenant exists and is not already linked to another account. The API remains the source of truth; a frontend select is not an authorization control.

## Tenant APIs

| Frontend feature | Endpoint |
|---|---|
| Own tenancy profile | `GET /tenants/me` |
| Download own agreement | `GET /tenants/me/agreement` |
| Create maintenance ticket | `POST /maintenance-tickets` |
| List own ticket statuses | `GET /maintenance-tickets/mine` |

The tenant UI does not call `GET /tenants`. A tenant profile includes `tenantName`, `apartmentNumber`, `monthlyRent`, timestamps, and sanitized agreement metadata (`originalName`, `mimeType`, `size`, `uploadedAt`). The tenant-facing API deliberately omits the file-system path.

Tenant ticket status responses contain `ticketId` and `status`; the UI displays only status. Tenant ticket creation sends only `subject` and `description`, matching the current Zod schema. Ticket status values are `open`, `in_progress`, `resolved`, and `closed`.

## Account registration and tenant linking

Public registration (`POST /users`) creates a tenant-role account with `tenantId: null`. The frontend tells newly registered users that the owner must link the account to the matching tenant record before they can use tenant-specific services. The Owner → Users page provides the owner-side linking flow through `PATCH /users/:id`.

## Important implementation rules

- Do not trust the role, user ID, or tenant ID passed from the browser as proof of identity; the backend uses the authenticated persisted user.
- Keep owner-only management endpoints protected by backend role middleware.
- Do not display tenant ticket IDs or issue details in the tenant interface, even though a ticket ID is present in the API's status-only DTO for internal identification.
- Keep tenant agreement metadata read-only; tenants have no upload, replacement, or deletion UI.
- If a tenant account is unlinked, show a clear message and disable tenant actions that require a tenant association.

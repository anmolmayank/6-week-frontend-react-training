# Role-Based Dashboard Requirements — Frozen Baseline

**Status:** Approved baseline for implementation. Changes to role permissions or ticket privacy should be treated as requirement changes rather than incidental UI changes.

## Product experiences

### Owner workspace

The owner dashboard gives the owner a portfolio-wide view and management capabilities:

- Portfolio overview and monthly rent summary derived from tenant records.
- View and manage all tenant records.
- Create tenants with an optional rental-agreement PDF in the same form (create tenant first, then upload against the returned tenant ID).
- Edit tenant details and, in edit mode, replace or explicitly remove the current agreement.
- Upload/replace, download, and delete rental agreements from tenant rows.
- Delete a tenant only after explicit confirmation; the current backend route unlinks the associated login account and attempts agreement-file cleanup.
- View maintenance tickets, see their complete details, take action, and update status.
- Future navigation may include user management, reports, and settings.

### Tenant portal

The tenant portal is restricted to the authenticated tenant's own data:

- View personal and tenancy information in read-only mode.
- Access their own rental agreement in read-only mode.
- Create maintenance/query tickets.
- View only the current status of their own tickets; ticket references and details are hidden.
- No ability to edit tenant or rental information, upload/replace/delete agreements, update ticket status, view ticket descriptions/attachments/internal notes after submission, or access another tenant's records.

## Ticket privacy and lifecycle

Owner actions and tenant visibility are deliberately different:

| Data/action | Owner | Tenant |
|---|---|---|
| All ticket references and statuses | Yes | No |
| Current status for their own ticket | Yes | Yes |
| Full ticket description, category, attachments, internal notes | Yes | No after submission |
| Create a ticket | Not in initial scope | Yes, for their own tenancy only |
| Update status / record owner action | Yes | No |

The implemented initial status flow is `Open → In Progress → Resolved → Closed`, represented by the backend enum `open`, `in_progress`, `resolved`, and `closed`. The owner UI can update ticket status through the protected Node endpoint.

## Design direction

- Shared application shell with a persistent desktop sidebar and mobile drawer.
- Owner workspace uses navy sidebar and blue primary actions.
- Tenant workspace uses a visually distinct teal/green identity while sharing typography, spacing, components, and interaction conventions.
- Owner overview uses real tenant API data for total tenants, agreements on file, pending agreements, and total monthly rent.
- Do not present fabricated maintenance counts or historical income as real metrics.
- Floating AI assistant remains mounted at app level; any future data-aware assistant tools must respect the same owner/tenant authorization rules.

## Route proposal

### Owner

- `/owner/dashboard`
- `/owner/tenants`
- `/owner/agreements`
- `/owner/maintenance-tickets`
- `/owner/users`
- `/owner/reports`
- `/owner/settings`

### Tenant

- `/tenant/dashboard`
- `/tenant/my-details`
- `/tenant/my-agreement`
- `/tenant/maintenance-tickets`
- `/tenant/maintenance-tickets/new`

## Mandatory backend dependencies before production use

1. Login response provides a canonical user role (`owner` or `tenant`) and, for tenant users, a link to exactly one tenant record.
2. Every Node.js endpoint enforces role-based authorization and per-resource ownership. Client-side route guards are not security controls.
3. Tenant endpoints return only the authenticated tenant's own details and agreement. Tenant agreement download is read-only and tenant-scoped.
4. Ticket creation derives tenant identity from the authenticated principal rather than a client-supplied tenant ID.
5. Tenant ticket-list responses expose only the current status. Ticket references, full ticket details, and status mutation APIs are owner-only.
6. Owner-wide tenant, agreement, user, report, and ticket endpoints reject tenant-role requests server-side.
7. `DELETE /api/v1/tenants/:tenantId` must remain owner-authorized, validate the ObjectId, unlink the associated login account, and apply the documented agreement-file and ticket-retention policy.
8. Maintain integration tests for cross-tenant access attempts, role mismatch, and owner-only ticket operations.

## Current frontend integration status

The frontend consumes the updated backend contract:

- Login stores `data.user.role` and `data.user.tenantId`; session restoration uses `GET /api/v1/auth/me` rather than assuming a role for old sessions.
- Owner user management loads `GET /api/v1/users` and supports role/tenant linking through `PATCH /api/v1/users/:id`.
- Tenant profile and agreement pages use `GET /api/v1/tenants/me` and `GET /api/v1/tenants/me/agreement`.
- Owner maintenance screens use `GET /api/v1/maintenance-tickets` and `PATCH /api/v1/maintenance-tickets/:ticketId/status`.
- Tenant maintenance screens use `POST /api/v1/maintenance-tickets` and `GET /api/v1/maintenance-tickets/mine`. The UI displays statuses only, despite ticket IDs being available internally in the response.
- Public registration always creates an unlinked tenant account. The owner must link it to a tenant record before tenant-only APIs are available.

The Node.js backend must remain the source of truth for role and resource authorization. Frontend visibility and route guards are not security controls.

## Tenant agreement form behavior

The Add Tenant and Edit Tenant dialog supports an optional PDF upload (10 MB maximum) using the existing `POST /api/v1/tenants/:tenantId/agreement` endpoint and multipart field `agreement`. Creation happens first so the agreement always uses the created tenant ID. If tenant creation succeeds but upload fails, the user receives a partial-success message and can finish the upload from the tenant row without risking duplicate tenant creation. In edit mode the selected PDF replaces the current agreement; alternatively, the owner may choose to remove the current agreement explicitly.

## Tenant deletion implementation status

The frontend calls the owner-authorized `DELETE /api/v1/tenants/:tenantId` route after confirmation. The current backend implementation unlinks the associated login account and attempts agreement-file cleanup; maintenance tickets retain tenant snapshots for audit. Verify cleanup logs and data-retention behavior in integration tests.

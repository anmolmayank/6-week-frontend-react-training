# Tenant Agreement and Removal Workflows

## Owner capabilities restored in the frontend

- Upload a PDF rental agreement while adding a tenant.
- Replace the rental agreement in edit mode.
- Explicitly remove the existing agreement in edit mode.
- Continue to upload/replace, download, and delete an agreement from the tenant list.
- Request tenant deletion through an explicit confirmation dialog.

## Agreement request contract

The existing Node route uses `POST /api/v1/tenants/:tenantId/agreement` and Multer field `agreement`. The frontend creates/updates the tenant record first and uses the returned tenant ID for a separate agreement upload. Files are checked on the client for PDF extension/MIME type and a 10 MB maximum; server-side validation remains authoritative.

If tenant creation succeeds but the follow-up upload fails, the tenant is retained, a clear partial-success message is shown, and the dialog closes so the user does not create a duplicate tenant by retrying the whole form. The owner can upload the agreement from the tenant table.

## Tenant deletion backend dependency

The frontend delete mutation is wired to `DELETE /api/v1/tenants/:tenantId`, invalidates the tenant list on success, and displays backend errors when the operation fails. The previously shared Node.js `tenant.routes` file did not include this route, so the frontend call alone does not implement end-to-end deletion. Before enabling it in production, the backend needs to:

1. Add an owner-authorized `DELETE /api/v1/tenants/:tenantId` route.
2. Validate `tenantId` as a MongoDB ObjectId.
3. Decide whether tenant records are permanently deleted or soft-deleted.
4. Handle agreement metadata and the physical file without leaving orphaned files or deleting a shared file unexpectedly.
5. Return a documented status and standardized API response.
6. Add tests for success, invalid IDs, missing tenant, unauthenticated requests, non-owner access, and cleanup failures.

Until that backend contract is added and verified, the delete button should be treated as UI wired to a pending API contract rather than a fully supported production feature.

# RTK Query Mutations & Caching — Quick Notes

## 1. Why RTK Query?

RTK Query manages **server state** for us.

Instead of manually managing:

- API loading state
- API errors
- Cached responses
- Refetching
- Keeping UI data synchronized

RTK Query handles these automatically.

Basic flow:

```text
React Component
      ↓
RTK Query Hook
      ↓
API Request
      ↓
Backend
      ↓
MongoDB
```

## 2. Query vs Mutation

### Query

Used for **reading** data.

```ts
const { data, isLoading, isError } =
    useGetTenantsQuery();
```

### Mutation

Used for **changing** data.

```ts
useCreateTenantMutation()
useUploadAgreementMutation()
useDeleteAgreementMutation()
useLoginMutation()
```

## 3. The Important Part — Cache

When we execute:

```ts
useGetTenantsQuery();
```

RTK Query stores the response in its **cache**.

```text
GET /tenants
      ↓
RTK Query
      ↓
Cache
      ↓
Tenant Table
```

If another component requests the same query, RTK Query can use the existing cached data instead of unnecessarily making another request.

## 4. What Happens After a Mutation?

This is where **tags** become important.

```ts
getTenants: builder.query({
    query: () => "/tenants",
    providesTags: ["Tenants"],
}),

createTenant: builder.mutation({
    query: (data) => ({
        url: "/tenants",
        method: "POST",
        body: data,
    }),
    invalidatesTags: ["Tenants"],
}),
```

Relationship:

```text
getTenants
    │
    │ provides
    ▼
 "Tenants" cache
    ▲
    │ invalidates
    │
createTenant
```

## 5. What Does `invalidatesTags` Do?

When `createTenant()` succeeds:

```text
Mutation succeeds
      ↓
"Tenants" cache becomes invalid
      ↓
RTK Query knows cached tenant data may be stale
      ↓
Active getTenants query is refetched
      ↓
UI receives latest tenant list
```

We don't need to manually call `getTenants()`.

## 6. Rental Agreement Example

### Upload

```text
uploadAgreement
      ↓
invalidates "Tenants"
      ↓
getTenants refetches
      ↓
Agreement status changes
```

### Replace

```text
replace/upload
      ↓
invalidates "Tenants"
      ↓
latest agreement metadata appears
```

### Delete

```text
deleteAgreement
      ↓
invalidates "Tenants"
      ↓
"Download" disappears
      ↓
"Not Uploaded" appears
```

## 7. Why This Is Better Than Manual Refetching

### Without RTK Query

```ts
await createTenant(data);
await getTenants();
```

We would also need to manage loading, errors, data, refetching, and potential race conditions manually.

### With RTK Query

```ts
await createTenant(data).unwrap();
```

Flow:

```text
Mutation
   ↓
Invalidate Tag
   ↓
Refetch Active Query
   ↓
Update Cache
   ↓
React UI Updates
```

## 8. Shared Cache

Multiple components can use the same cached server state:

```text
TenantPage
    ↓
useGetTenantsQuery()


Dashboard
    ↓
useGetTenantsQuery()
```

Conceptually:

```text
              ┌── Tenant Page
              │
RTK Cache ────┼── Dashboard
              │
              └── Other Component
```

## 9. RTK Query vs Normal Redux State

### Redux state

Good for:

- theme
- sidebar state
- user preferences
- UI state

### RTK Query

Good for:

- tenants
- users
- rental agreement metadata
- API responses
- other server data

RTK Query is primarily for **server-state caching**.

## 10. `unwrap()`

We use:

```ts
await createTenant(data).unwrap();
```

This allows normal `try/catch` handling:

```ts
try {
    await createTenant(data).unwrap();

    showSuccess("Tenant created successfully.");
} catch (error) {
    showError("Unable to create tenant.");
}
```

This is especially useful for our **Snackbar implementation**.

## 11. PropertyNest Flow

```text
                    RTK QUERY
                       │
          ┌────────────┴────────────┐
          │                         │
       Queries                  Mutations
          │                         │
    getTenants              createTenant
          │                 uploadAgreement
          │                 deleteAgreement
          │                         │
          ▼                         ▼
       Cache                 Invalidate Tags
          ▲                         │
          └───────────┬─────────────┘
                      │
                      ▼
                  React UI
```

## 12. Key Interview Answer

> **RTK Query manages server-state caching automatically. Queries cache API responses, while mutations can invalidate specific cache tags. When a mutation invalidates a tag provided by an active query, RTK Query automatically refetches the affected data and updates the UI. This eliminates manual refetching and reduces duplicated server-state management.**

## 13. Remember These 5 Terms

**Query → Cache → Tags → Invalidate → Refetch**

That's the core concept we implemented in PropertyNest.

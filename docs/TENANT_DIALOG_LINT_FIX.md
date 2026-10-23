# Tenant Dialog Lint Fix

## Changes

1. Removed the `useEffect` that synchronously reset `agreementFile`, `agreementFileError`, and `removeExistingAgreement`. The parent now mounts `TenantDialog` only while the dialog is open, and the form initializes its default values directly from the selected tenant. This avoids the `react-hooks/set-state-in-effect` lint rule and naturally resets component-local state when the dialog closes.
2. Moved the responsive Stack alignment from the removed Material UI v9 `alignItems` system prop to `sx={{ alignItems: { xs: \"stretch\", sm: \"center\" } }}`.

## Verification

The source changes were inspected. A build could not be completed in the supplied working directory because its `node_modules` folder is incomplete (missing ambient type definitions including React and Node and an invalid TypeScript ignore-deprecations setting reported by the current incomplete installation). Lint could not be started because the ESLint executable is absent. Run `npm ci`, then `npm run build` and `npm run lint` in the project environment to verify the full project.

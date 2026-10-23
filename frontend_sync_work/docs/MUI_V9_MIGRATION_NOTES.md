# Material UI v9 migration notes

## Why the TypeScript errors occurred

The frontend uses `@mui/material` v9.2.0. Material UI v9 removed deprecated system styling props from components including `Box`, `Stack`, `Typography`, `Link`, and `Grid`. Props such as `fontSize`, `fontWeight`, `alignItems`, `justifyContent`, and `gap` therefore need to be represented in the `sx` object instead of being passed directly to those components.

The v9 migration guide documents these changes:
https://mui.com/material-ui/migration/upgrade-to-v9/

## Changes applied

- Migrated direct system style props on affected Material UI components to `sx`.
- Kept actual component props such as `Stack.direction`, `Stack.spacing`, `Typography.variant`, `Typography.noWrap`, and `TextField.size` as component props.
- Updated the `TextField` prop API:
  - `InputProps` → `slotProps.input`
  - `inputProps` → `slotProps.htmlInput`
- Preserved the intent of responsive styles by moving responsive values into `sx`.
- Did not change endpoint URLs, role policy, or API behavior as part of this TypeScript fix.

## Verification

- TypeScript/TSX syntax parsing: passed for 69 source files.
- Checked that no `InputProps`/`inputProps` legacy usages remain in `src`.
- Checked that old direct system props in the migrated component set are no longer present.
- A full production type-check/build and lint run could not be completed in this environment because npm dependency installation could not finish: the npm registry lookup failed with `EAI_AGAIN`. The global TypeScript installation is older than the repo's configured TypeScript version, and the project `node_modules` is therefore incomplete. Re-run after a successful `npm ci`:
  ```bash
  npm ci
  npm run lint
  npm run build
  ```

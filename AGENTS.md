# Repository Guidelines

The Vue 3 single-page app lives in `frontend/`. Follow these guardrails to keep contributions lean and predictable.

## Project Structure & Module Organization
- `frontend/src/main.js` boots Vue and registers the router; add global plugins or providers there.
- Views belong in `frontend/src/views/`, shared leaf components in `frontend/src/components/`, and stateful composition utilities under `frontend/src/stores/` (see `auth.js` for the pattern).
- Route definitions stay co-located in `frontend/src/router/index.js` with lazy-loaded routes; place any per-route guards alongside the view.
- Static files go to `frontend/public/` for direct serving or `frontend/src/assets/` when imported by SFCs; global styles live in `frontend/src/style.css`.

## Build, Test, and Development Commands
```bash
cd frontend
npm install          # install dependencies
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # emit production bundle into dist/
npm run preview      # serve the built bundle for smoke testing
```

## Coding Style & Naming Conventions
- Use 2-space indentation across JS, Vue, and CSS; prefer single quotes in JS and PascalCase for component symbols (`CustomerTable`) while keeping filenames in kebab-case (`customer-table.vue`).
- Favor `<script setup>` SFCs, keep business logic in composables or stores, and guard router navigation with helpers (see `src/router/index.js`).
- Scope component styles unless intentionally global; reuse design tokens from `style.css` when introducing layout primitives.

## Testing Guidelines
- Automated tests are not yet configured. For now, rely on `npm run preview` to verify login redirects, dashboard access, and table interactions across major browsers.
- When adding tests, use Vitest + Vue Test Utils stored under `frontend/src/__tests__/` mirroring component names (`HomeView.spec.js`); target critical flows such as auth guards and data table rendering before merging.

## Commit & Pull Request Guidelines
- Follow an imperative, present-tense summary, optionally with conventional prefixes (`feat: add contact filtering`). Keep scope focused and reference tickets with `(#123)` when applicable.
- Branch names mirror existing work: `codex/<short-feature>` is preferred.
- Pull requests should include: purpose summary, screenshots or GIFs for UI changes, checklists of impacted routes, and confirmation that `npm run build` and preview checks passed.

## Environment & Configuration
- Never commit secrets; use `.env.local` (gitignored) with `VITE_`-prefixed variables, and document any new keys in the PR.
- Local storage is used for auth state (`src/stores/auth.js`); update the storage key consciously and outline migration steps when modifying persisted shape.

# AGENTS.md

## Project

Laravel 13 + React 19 (Inertia v3) app. PHP 8.3+, TypeScript, Tailwind CSS v4, Vite 8.
Wayfinder for typed route generation. Laravel Reverb for broadcasting. React Compiler enabled via Babel.

## Key Commands

```bash
# Full dev stack (server + queue + vite)
composer dev

# PHP checks
composer lint          # Pint auto-fix
composer lint:check    # Pint dry-run
composer types:check   # PHPStan level 7

# Frontend checks
npm run lint           # ESLint auto-fix
npm run lint:check     # ESLint dry-run
npm run format         # Prettier auto-fix
npm run format:check   # Prettier dry-run
npm run types:check    # tsc --noEmit

# Tests
php artisan test       # Pest (SQLite in-memory)
# Or: composer test    # clears config + lint:check + types:check + test

# CI check (what CI runs)
composer ci:check      # lint:check → format:check → types:check → test
```

**Order matters:** `lint` → `types:check` → `test`. The `composer test` script chains these automatically.

## Testing

- Pest v4 with `tests/Pest.php` as bootstrap. Tests use SQLite in-memory (`phpunit.xml`).
- `RefreshDatabase` trait is commented out in `Pest.php` — uncomment if your test needs DB state.
- Feature tests in `tests/Feature/`, Unit tests in `tests/Unit/`.

## Code Style

- **PHP:** Laravel Pint preset (`pint.json`). 4-space indent, LF line endings.
- **TypeScript/React:** Prettier + ESLint. 4-space indent, single quotes, semicolons.
- ESLint enforces: `consistent-type-imports` (use `type` imports), `import/order` (alphabetized), `curly: always`, 1TBS brace style with padding around control statements.
- Prettier has `prettier-plugin-tailwindcss` — class sorting is automatic.
- `.npmrc` has `ignore-scripts=true`.

## Frontend Structure

- Entry: `resources/js/app.tsx`
- Pages: `resources/js/pages/` (Inertia page components)
- Routes/Actions: `resources/js/routes/` and `resources/js/actions/` (Wayfinder-generated, ESLint ignored)
- UI components: `resources/js/components/ui/` (ESLint ignored)
- Utils: `resources/js/lib/utils.ts`
- Wayfinder index: `resources/js/wayfinder/index.ts`

## Design System

`DESIGN.md` contains the full design system spec. Key rules:
- **Zero border radius everywhere** — all components use sharp corners.
- **Bold/energetic style** — vibrant brand colors, punchy typography.
- Use design tokens, never raw hex values in components.
- Dark mode is automatic via CSS custom properties.
- Font: Instrument Sans (loaded via Vite plugin). Heading font: Gabarito (see typography.md).
- Landing page sections all use brand background color — no alternating neutrals.

## Deviations from Defaults

- `pnpm-workspace.yaml` exists but npm is used (CI uses `npm`). Use npm for consistency.
- Tests run against SQLite in-memory, not MySQL/Postgres.
- PHPStan level 7 (strict-ish for Laravel).
- React Compiler (experimental Babel plugin) is active.

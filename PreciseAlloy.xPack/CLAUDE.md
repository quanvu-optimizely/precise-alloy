# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

`@quanvu-optimizely/xpack` — a build toolchain CLI for pattern library projects built on Vite + React. Published as an npm package consumed by frontend projects (e.g. `PreciseAlloy.Frontend`). The CLI (`xpack`) orchestrates dev server, SCSS compilation, script bundling, prerendering, and integration builds.

## Commands

```bash
npm run build          # TypeScript compilation (tsc) → dist/
npm test               # Run all tests (vitest, jsdom environment)
npm run test:watch     # Watch mode
npx vitest run src/filename.test.ts   # Single test file
```

Tests live alongside source files as `*.test.ts`. Test root is `src/`.

## Architecture

**CLI entry**: `bin/xpack.ts` → `src/cli.ts` (commander). Subcommands: `generate`, `styles`, `scripts`, `dev`, `build`, `prerender`, `integrate`, `states`.

**Vite plugin** (`src/config.ts`): Custom Vite config exported via `./vite-plugin`. Registers a chain of custom Vite hooks under `src/hooks/` (build-start, transform, inject-functions, write-bundle, close-bundle, etc.).

**Package exports**:
- `.` → core utilities (config loader, paths, alias, style helpers)
- `./config` → `XPackConfig` type and loaders
- `./styles` → SCSS compilation helpers
- `./vite-plugin` → full Vite config

**Config resolution** (`src/xpack-config.ts`): Looks for `xpack.config.{ts,js,mjs,json}` in the consumer project root. Merges with defaults. Cached per root.

**Core pipelines** — each has a `*-core.ts` (pure logic, dependency-injected) and a thin runner file:
- `styles-core.ts` / `styles.ts` — SCSS compilation with auto-injected abstracts/functions/mixins prelude; source map stripping for injected lines
- `scripts-core.ts` / `scripts.ts` — esbuild transform of `src/assets/scripts/**`, outputs to `public/assets/js/`
- `prerender-core.ts` / `prerender.ts` — HTML post-processing with cheerio: asset hashing, resource path rewriting, duplicate asset removal
- `integration-core.ts` / `integration.ts` — copies build artifacts to CMS integration directories, collects asset hashes, copies/normalizes pattern HTML

**Dependency injection pattern**: Core modules accept a `Dependencies` object (fs ops, glob, logger, etc.) as a parameter, defaulting to real implementations. Tests supply mocks through this interface rather than module mocking.

**Path handling**: All paths normalized to forward slashes via the `slash` package. `src/paths.ts` resolves `root`, `srcRoot`, `outDir` from `process.cwd()` and loads Vite env vars.

**Alias system** (`src/alias.ts`): Default aliases (`@atoms`, `@molecules`, `@organisms`, `@templates`, `@pages`, `@assets`, `@helpers`, `@data`, `@_http`, `@_api`, `@mocks`) resolved relative to consumer's `src/`. Consumer `xpack.config` aliases override defaults.

**App shell** (`src/root/`): React components for the pattern library shell (navigation, frame controls, theme switching). These are bundled into the consumer's dev server and production build.

**Scripts** (`src/scripts/`): Browser-side entry points (`root.entry.ts`, `pl-states.entry.ts`, `color-mode.entry.ts`, etc.) and helper functions. These run in the consumer's browser, not during build.

## Conventions

- Atomic Design hierarchy: atoms → molecules → organisms → templates → pages
- SCSS output naming: organisms get `b-` prefix, templates get `p-` prefix
- Asset content hashing uses SHA-1, base64url, truncated to 10 chars
- Files with `0x[hex]` in the name are treated as already content-hashed
- `tsconfig.json` excludes test files and several app-shell files (react-loader, entry-client/server, routes, app, template) from compilation — these are consumer-side files scaffolded by `xpack generate`

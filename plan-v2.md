# PreciseAlloy.xPack — Library Extraction Plan

## Overview

Extract `PreciseAlloy.Frontend/xpack/` into a standalone `PreciseAlloy.xPack/` npm library at the repo root, publishable as `@quanvu-optimizely/xpack` with a proper CLI (`xpack <command>`).

## Key Challenges Identified

1. **Hardcoded paths** — `styles.ts`, `styles-core.ts`, `routes.ts`, `paths.ts` all reference consumer's `src/` directory structure
2. **React as runtime dep** — React 19.2.4 is currently a direct dependency, needs to become a peer dependency
3. **No CLI binary** — `bin/cli.js` is declared in package.json but doesn't exist; commands run via `bun xpack/*.ts`
4. **Build tooling deps** — sass, postcss, vite, chokidar etc. are in devDependencies but need to be regular dependencies in the library

---

## Phase 1: Scaffold `PreciseAlloy.xPack/`

1. Create `PreciseAlloy.xPack/` directory at repo root
2. Create `package.json`:
   - name: `@quanvu-optimizely/xpack`
   - type: `module`
   - bin: `{ "xpack": "./bin/cli.js" }`
   - engines: `{ "node": ">=20.0.0" }`
   - Move React, react-dom, react-router-dom → `peerDependencies` with flexible ranges (`">=18.0.0"`)
   - Move build tools (vite, sass, postcss, autoprefixer, cssnano, chokidar, glob, etc.) → `dependencies`
   - TypeScript, vitest, eslint → `devDependencies`
3. Create `tsconfig.json` — compile to `dist/` with ESM output, declaration files
4. Copy all files from `PreciseAlloy.Frontend/xpack/` → `PreciseAlloy.xPack/src/`

## Phase 2: Make Paths Configurable

5. Create `src/xpack-config.ts` — a configuration loader that:
   - Reads an `xpack.config.ts` (or `.js`/`.json`) from the consumer's project root
   - Defines defaults matching current convention (`src/`, `dist/`, `public/assets/`)
   - Exports a typed `XPackConfig` interface
6. Refactor `src/paths.ts` — replace hardcoded `currentDir/../` logic with config-driven resolution from consumer's `process.cwd()`
7. Refactor `src/styles.ts` and `src/styles-core.ts` — replace hardcoded SCSS prelude paths (`src/assets/styles/00-abstracts/...`) with config-driven paths
8. Refactor `src/routes.ts` — replace `import.meta.glob('../src/pages/*.tsx')` with a pattern that the consumer provides (or generate a routes file via `xpack generate`)
9. Refactor `src/alias.ts` — make the `@atoms`, `@molecules`, etc. aliases configurable with sensible defaults

## Phase 3: Build the CLI

10. Create `src/cli.ts` — main CLI entry using a command parser (e.g. `commander` or lightweight custom):
    ```
    xpack generate    → scaffold config + entry files in consumer project
    xpack styles      → run SCSS compilation (wraps styles.ts)
    xpack scripts     → run script compilation (wraps scripts.ts)
    xpack dev         → start Vite dev server (wraps server.ts)
    xpack build       → run production build (wraps config.ts)
    xpack prerender   → run prerendering (wraps prerender.ts)
    xpack integrate   → run integration build (wraps integration.ts)
    xpack states      → generate state JSON (wraps states.ts)
    ```
11. Create `bin/cli.js` — thin shim: `#!/usr/bin/env node` that imports the compiled CLI
12. Implement `xpack generate` — scaffolds into consumer project:
    - `xpack.config.ts` (config file with project-specific paths)
    - `src/routes.ts` (the glob-based routes file — must live in consumer)
    - `vite.config.ts` (re-exports from library)
    - Entry files: `entry-client.tsx`, `entry-server.tsx` (if they need consumer customization)

## Phase 4: Package Build & Exports

13. Configure build step (tsup or tsc) to compile `src/` → `dist/`
14. Define `package.json` exports map:
    ```json
    "exports": {
      ".": "./dist/index.js",
      "./config": "./dist/config.js",
      "./styles": "./dist/styles/index.js",
      "./vite-plugin": "./dist/vite-plugin.js"
    }
    ```
15. Create `src/index.ts` — main export barrel for programmatic API
16. Include SCSS partials (`src/styles/*.scss`) as distributable assets (copy to `dist/styles/`)
17. Include React components (`src/root/`) in the build output

## Phase 5: Update Consumer (`PreciseAlloy.Frontend`)

18. Add `@tquanvu-optimizely/xpack` as a dependency (workspace link or version)
19. Keep `xpack/` folder references with library imports
20. `vite.config.ts` → import config from the library
21. npm scripts → add `xpack` CLI commands, keep `bun xpack/*.ts` for legacy using
22. Keep consumer-specific files in-place: `routes.ts`, `xpack.config.ts`, entry files

## Phase 6: Testing & Publishing

23. Move existing test files (`*.test.ts`) to `PreciseAlloy.xPack/src/`
24. Configure vitest in the new package
25. Ensure all tests pass with the refactored paths
26. Add `prepublishOnly` script for build
27. Add `.npmignore` or `files` field to package.json
28. Test `npm pack` to verify package contents

---

## Dependency Classification

| Category | Packages |
|---|---|
| **peerDependencies** | react (>=18), react-dom (>=18), react-router-dom (>=6) |
| **dependencies** | vite, sass, postcss, autoprefixer, cssnano, chokidar, glob, debounce, slash, cheerio, magic-string, commander |
| **devDependencies** | typescript, vitest, eslint, @types/react, @types/node |

---

## File Structure

```
PreciseAlloy.xPack/
├── bin/
│   └── cli.js              # Node shim → dist/cli.js
├── src/
│   ├── cli.ts              # CLI command router
│   ├── index.ts            # Public API barrel
│   ├── xpack-config.ts     # Config loader + XPackConfig type
│   ├── paths.ts            # Config-driven path resolution
│   ├── config.ts           # Vite config factory
│   ├── styles.ts           # SCSS build command
│   ├── styles-core.ts      # SCSS compilation core
│   ├── scripts.ts          # Script build command
│   ├── scripts-core.ts     # Already uses DI pattern
│   ├── ... (all other .ts/.tsx files)
│   ├── hooks/              # Vite plugin hooks
│   ├── root/               # React UI components
│   ├── scripts/            # Browser entry scripts
│   └── styles/             # SCSS partials (distributed as-is)
├── dist/                   # Compiled output (gitignored)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

# NEOB CONTRIBUTOR GUIDE

Repository guidance for agents and contributors authoring, reviewing, testing, and releasing `neob`. Consumer setup and public API usage belong in `packages/neob-ui/README.md` and `packages/neob-ui/USAGE.md`.

## OVERVIEW

High-contrast React 19 component library (`neob`). Form-focused inputs with opt-in wrappers, touch-gated tooltips, sliding indicator segmented tabs, animated overlays, and performant virtualized viewports. Built on React 19, Base UI, Tailwind CSS v4, Motion, and Storybook. Driven by Bun as the package manager and Vitest for testing.

## STRUCTURE

```text
neob/
├── .storybook/                    # Storybook configuration and theme setup
├── packages/
│   └── neob-ui/
│       ├── src/
│       │   ├── components/ui/     # Component folders, implementations, and stories
│       │   ├── hooks/             # Shared React hooks
│       │   ├── lib/               # Shared utilities and Storybook helpers
│       │   ├── styles/            # Theme, base, utilities, properties, and effects
│       │   ├── index.css          # Tailwind stylesheet entry point
│       │   └── index.ts           # Public package exports
│       ├── package.json           # Package scripts, dependencies, and exports
│       ├── tsconfig.json          # Package TypeScript configuration
│       └── vite.config.ts         # Library-mode build configuration
├── package.json                   # Workspace scripts
└── vitest.workspace.ts            # Workspace test configuration
```

## WHERE TO LOOK

| Task                      | Location                                                       | Notes                                                               |
| ------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------- |
| Component implementations | `packages/neob-ui/src/components/ui/{name}/{name}.tsx`         | Authoritative component implementation.                             |
| Storybook stories         | `packages/neob-ui/src/components/ui/{name}/{name}.stories.tsx` | Public examples and browser tests; read before editing a component. |
| Hooks and auto-resizing   | `packages/neob-ui/src/hooks/`                                  | Shared hooks and layout behavior.                                   |
| Global stylesheet entry   | `packages/neob-ui/src/index.css`                               | Keep limited to imports and Tailwind directives.                    |
| Design tokens and CSS     | `packages/neob-ui/src/styles/`                                 | Theme sources, derived tokens, utilities, and effects.              |
| Shared CSS utilities      | `packages/neob-ui/src/lib/utilities.ts`                        | `cn(...)` and theme utility helpers.                                |
| Bundle build configs      | `packages/neob-ui/vite.config.ts` and package `tsconfig`       | Bundling and compiler directives.                                   |

---

## DESIGN SYSTEM TOKENS & COLORS

All color sources live at the top of `packages/neob-ui/src/styles/theme.css`. Edit `:root` for light mode and `.dark` for dark mode. Keep the derived Tailwind `@theme` mappings below the editable sources.

- **Semantic sources:** `--background`, `--foreground`, `--edge`, `--primary`, `--muted`, `--border`, `--ring`, `--card`, `--popover`, and `--destructive`, including foreground counterparts.
- **Palette sources:** `--palette-cyan`, `--palette-gold`, `--palette-zinc`, `--palette-coral`, `--palette-blue`, `--palette-purple`, `--palette-pink`, `--palette-yellow`, `--palette-red`, and `--palette-green`.
- **Derived Tailwind tokens:** `--color-*` mappings and light/dark palette variants belong in `@theme`; do not duplicate source values there.
- **Typography:** `--font-sans` uses Rubik, `--font-display` uses Rubik Variable, and `--font-mono` uses JetBrains Mono with fallbacks.

---

## KEY UTILITY CLASSES

Prefer these utilities when the corresponding treatment is required:

- `shadow-cel`, `shadow-cel-sm`, and `shadow-cel-lg` provide token-driven solid drop shadows.
- `shadow-cel-inset` and `shadow-cel-inset-sm` provide inset treatments.
- `neo-focus-ring` provides the shared focus-visible ring.
- `underline-slide` provides the shared animated link underline.

---

## CONVENTIONS

### Styling (CRITICAL)

- **Borders & Tokens**: Colors must lean on curated tokens rather than standard Tailwind shades (e.g., `border-black`, `bg-zinc`, custom theme variables). Never use raw Tailwind colors like `bg-blue-500` or `text-gray-900`.
- **Color space**: Prefer `oklch(...)` for all authored color values and `color-mix(in oklch, ...)` for derived colors. Use another color space only when an external API, browser serialization, or color-input format requires it.
- **Tailwind class merging**: Always utilize the exposed `cn(...)` utility helper when combining conditional classes dynamically.
- **Hover interactions**: Use Tailwind v4 `hover:` and `group-hover:` variants in class strings. Inside `@utility` declarations, use `@variant hover { ... }` instead of raw `&:hover` selectors so Tailwind applies its hover-capability guard and avoids sticky touchscreen states. Keep raw hover media queries only for deliberate fallback behavior such as `hover-always` and `group-hover-always`.
- **Mode/theme**: Custom light/dark themes are applied via the `.dark` class wrapper, targeting root variables or components.
- **CSS custom property declarations**: Every project-owned custom property must be declared before use. Register typed or animated properties in `packages/neob-ui/src/styles/properties.css`; declare cascading design tokens in `packages/neob-ui/src/styles/theme.css`. Tailwind-owned `--tw-*` properties are exempt.
- **Stylesheet boundaries**: Keep `packages/neob-ui/src/index.css` limited to imports and Tailwind directives. Add styles to the focused module in `packages/neob-ui/src/styles/` rather than growing the entry point.

### Components

- **Stories first**: Read a component's implementation and colocated story before changing its API or behavior.
- **Single Component Imports**: Use compound components through their public parent API (for example, `import { Tabs } from '@joyful.tools/neob';` with `<Tabs.List>` and `<Tabs.Trigger>`).
- **Ref Forwarding**: All elements support modern React 19 ref-as-prop pattern. Do NOT use `forwardRef`.
- **Early Returns**: Write early return statements for guard clauses.
- **Display Names**: Always set `displayName` (e.g., `Tabs.displayName = 'Tabs'`) to aid React Developer Tools debugging.

### TypeScript

- **Fully Typed**: Parameters must be fully typed. Do NOT use `as` assertions.
- **No `any` type**: Use explicit types or generics instead of `any`.

### Comments & Documentation (CRITICAL)

- **No Redundant Comments**: Avoid writing redundant comments that describe "WHAT" code is doing if it is already clear from the implementation (e.g., `// check if is open` above `if (isOpen) { ... }`).
- **Explain the "WHY"**: Keep or write critical comments that explain "WHY" something is done (e.g., hacks, workarounds, edge cases, specific animations, complex math formulas, non-obvious optimizations).
- **No Banner/Divider Comments**: Do not include visual block comments like `// =============` or `// Components` to separate code. Keep the structure clean.

---

## ANTI-PATTERNS

| Pattern                                            | Why                                                     | Instead                                                    |
| :------------------------------------------------- | :------------------------------------------------------ | :--------------------------------------------------------- |
| `bg-blue-500`, `text-gray-900`                     | Breaks the visual theme                                 | Use semantic/curated tokens: `bg-blue`, `bg-zinc`          |
| Using `forwardRef`                                 | Redundant in React 19, which supports direct `ref` prop | Pass `ref` as a regular prop to the component              |
| Redundant comments (e.g. `// check if open`)       | Clutters the codebase without adding value              | Write self-documenting code; explain only the "why"        |
| Visual block comments / divider banners            | Clutters the file structure                             | Keep structure clean with standard spacing                 |
| `as` type assertions                               | Bypasses TypeScript compiler safety                     | Fully type parameters, interfaces, and return values       |
| Importing sub-components directly (e.g. `TabList`) | Violates component coupling conventions                 | Import parent `Tabs` and use `<Tabs.List>`                 |
| Editing auto-generated files                       | Changes will be lost on subsequent builds               | Edit source configs or run code generator                  |
| Using undeclared project-owned CSS properties      | Hides types, defaults, and inheritance behavior         | Declare tokens or register them in `styles/properties.css` |

---

## COMMANDS

Execute all commands using `bun`:

```bash
bun run storybook           # Launch Storybook dev server (localhost:6006)
bun run build               # Build the library bundle via Vite
bun run lint                # Prettier checks + ESLint checking
bun run format              # Format files using Prettier and ESLint autofix
bun run typecheck           # Run TypeScript compiler checks (`tsc --noEmit`)
bun run storybook:test      # Run component tests via Vitest
bun run check               # Run lint + typecheck + storybook tests with coverage
```

## CHANGESETS

- Create changesets with `bun changeset`; never manually create or name files in `.changeset/`.
- Select every affected published package, choose its semantic version bump, and enter the consumer-facing changelog summary through the CLI prompts.
- Review all package changes since the latest version commit before choosing the affected package, bump type, and release summary.
- Use `patch` for backward-compatible fixes and refinements, `minor` for backward-compatible features, and `major` for breaking changes.
- Explain what changed and why. Include migration guidance when consumers must update their code.
- Commit the CLI-generated changeset with the relevant implementation. Multiple independent consumer-facing changes may use separate changesets.
- Repository-only maintenance that does not affect a published package does not need a changeset.
- Validate the pending release plan with `bun changeset status`.
- Leave package versioning, changelog generation, changeset consumption, and publishing to the automated release process; do not perform those operations manually during normal feature work.

---

## TOOLCHAIN

| Tool         | Version       | Notes                                                 |
| :----------- | :------------ | :---------------------------------------------------- |
| Node         | ^20.x / ^22.x | Runtime environment                                   |
| Bun          | ^1.x          | Package manager and runner (driven by `bun.lock`)     |
| React        | ^19.2.3       | Core framework                                        |
| Vite         | ^6.4.2        | Bundler (library build mode)                          |
| Tailwind CSS | ^4.1.18       | Utility styling framework via `@tailwindcss/vite`     |
| ESLint       | ^9.39.4       | Code linting                                          |
| Prettier     | ^3.7.4        | Code formatting                                       |
| Vitest       | ^4.1.7        | Test runner supporting playwright browser environment |
| Storybook    | ^10.4.1       | UI component playground and testing environment       |

---

## SECURITY

- **NEVER commit** secrets, API keys, or personal developer tokens.
- Keep `.env` and environment configs gitignored.
- Ensure Storybook build configs do not expose sensitive local build environments.

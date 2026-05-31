# NEOB KNOWLEDGE BASE

**Generated:** 2026-05-31 | **Branch:** main

## OVERVIEW

Brutalist React 19 component library (`neob`). Form-focused inputs with opt-in wrappers, touch-gated tooltips, sliding indicator segmented tabs, animated overlays, and performant virtualized viewports. Built on React 19, Base UI, Tailwind CSS v4, Framer Motion (motion/react), and Storybook. Driven by Bun as the package manager and Vitest for testing.

## STRUCTURE

```
neob/
├── .storybook/              # Storybook configurations and theme setup
├── src/
│   ├── components/          # React components
│   │   └── ui/              # Stark brutalist atom/molecule components
│   ├── hooks/               # Core React hooks (useInputAreaAutoResize, useTransformOrigin, useDeferredOpen)
│   ├── lib/                 # Shared utilities and Storybook integration helpers
│   ├── index.css            # Global CSS containing Tailwind classes and custom tokens
│   └── index.ts             # Library barrel exports
├── package.json             # Scripts, dependencies, and bundle configuration
├── tsconfig.json            # TypeScript compile configurations
└── vite.config.ts           # Library-mode build config
```

## WHERE TO LOOK

| Task                      | Location                                  | Notes                                                         |
| ------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| Component implementations | `src/components/ui/{name}.tsx`            | Direct atomic component implementation files.                 |
| Hooks and auto-resizing   | `src/hooks/use-input-area-auto-resize.ts` | Layout and textarea sizing logic.                             |
| Storybook stories         | `src/components/ui/{name}.stories.tsx`    | Component playground and visual verification setup.           |
| Global design tokens      | `src/index.css`                           | Theme and token definitions (colors, fonts, variables).       |
| Shared CSS utilities      | `src/lib/utilities.ts`                    | The `cn(...)` Tailwind merge helper and `getThemeColor(...)`. |
| Bundle build configs      | `vite.config.ts` & `tsconfig.json`        | Bundling and compiler directives.                             |

---

## DESIGN SYSTEM TOKENS & COLORS

All colors are controlled by CSS Custom Variables declared in `index.css`. The tailwind variants utilize these tokens:

- **Custom Colors:**
  - Orange: `var(--color-orange)` (`#f48120`)
  - Gold: `var(--color-gold)` (`#faad3f`)
  - Zinc: `var(--color-zinc)` (`#232426`)
  - Coral: `var(--color-coral)` (`#ff6b4a`)
  - Blue: `var(--color-blue)` (`#60a5fa`)
  - Purple: `var(--color-purple)` (`#c084fc`)
  - Pink: `var(--color-pink)` (`#f472b6`)
  - Yellow: `var(--color-yellow)` (`#fae315`)
  - Red: `var(--color-red)` (`#ef4444`)
  - Green: `var(--color-green)` (`#19c056`)
- **Theme Variables (Light / Dark Mode):**
  - Background: `var(--background)` (Light: `0 0% 100%` / Dark: `0 0% 3.9%`)
  - Foreground: `var(--foreground)` (Light: `0 0% 3.9%` / Dark: `0 0% 98%`)
  - Muted: `var(--muted)` (Light: `0 0% 96.1%` / Dark: `0 0% 14.9%`)
  - Border: `var(--border)` (Light: `0 0% 89.8%` / Dark: `0 0% 14.9%`)
  - Card: `var(--card)` (Light: `0 0% 100%` / Dark: `0 0% 3.9%`)
- **Typography:**
  - Sans: `var(--font-sans)` ('Urbanist', sans-serif)
  - Display (Headings): `var(--font-display)` ('Dela Gothic One', sans-serif)
  - Monospace: `var(--font-mono)` ('JetBrains Mono', monospace)

---

## KEY UTILITY CLASSES

Always apply these custom brutalist classes when building layouts:

- `shadow-cel` - Stark 4px solid black drop shadow.
- `shadow-cel-sm` - 2px solid black drop shadow (ideal for tags/buttons).
- `shadow-cel-lg` - 8px solid black drop shadow (ideal for hover states).
- `shadow-cel-inset` - Inset shadow for active button states.
- `shadow-cel-inset-sm` - Inset shadow for inputs/meter tracks.
- `neo-focus-ring` - Focus-visible border-offset outline animation.
- `underline-slide` - Hover slide-out underline effect for link items.

---

## CONVENTIONS

### Styling (CRITICAL)

- **Brutalist Border & Tokens**: Colors must lean on curated tokens rather than standard Tailwind shades (e.g., `border-black`, `bg-zinc`, custom theme variables). Never use raw Tailwind colors like `bg-blue-500` or `text-gray-900`.
- **Tailwind class merging**: Always utilize the exposed `cn(...)` utility helper when combining conditional classes dynamically.
- **Mode/theme**: Custom light/dark themes are applied via the `.dark` class wrapper, targeting root variables or components.

### Components

- **Single Component Imports**: Always import compound components via their parent component (e.g., `import { Tabs } from 'neob';` and use `<Tabs.List>`, `<Tabs.Trigger>`, etc.).
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

| Pattern                                            | Why                                                     | Instead                                              |
| :------------------------------------------------- | :------------------------------------------------------ | :--------------------------------------------------- |
| `bg-blue-500`, `text-gray-900`                     | Breaks brutalist theme, fails styling guidelines        | Use semantic/curated tokens: `bg-blue`, `bg-zinc`    |
| Using `forwardRef`                                 | Redundant in React 19, which supports direct `ref` prop | Pass `ref` as a regular prop to the component        |
| Redundant comments (e.g. `// check if open`)       | Clutters the codebase without adding value              | Write self-documenting code; explain only the "why"  |
| Visual block comments / divider banners            | Clutters the file structure                             | Keep structure clean with standard spacing           |
| `as` type assertions                               | Bypasses TypeScript compiler safety                     | Fully type parameters, interfaces, and return values |
| Importing sub-components directly (e.g. `TabList`) | Violates component coupling conventions                 | Import parent `Tabs` and use `<Tabs.List>`           |
| Editing auto-generated files                       | Changes will be lost on subsequent builds               | Edit source configs or run code generator            |

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

# Building with `neob` without fighting it

A reusable rulebook for AI agents (and humans) authoring or consuming the
`neob` brutalist component library. Earned from the actual shape of this
codebase — every rule below maps to a real file you can open and verify.

**How to use:** in `AGENTS.md` (or your `CLAUDE.md`), keep a line like
`neob discipline: see USAGE.md.` and link to this file. Pair it with
`AGENTS.md`, which holds the design-token reference and project structure.

---

## §0 — The one rule that beats every other rule

> **Read the component's `*.stories.tsx` BEFORE writing code that uses or
> edits it.** Not after, not while debugging. Before.

Every component ships a colocated story file next to its implementation
(e.g. `packages/neob-ui/src/components/ui/button/button.stories.tsx`). The
stories are the canonical, executable API reference — every variant, every
compound subcomponent, every prop in real usage. They are also the test
fixtures (`bun run storybook:test`), so they are guaranteed current.

If you skip this, you will:

- Invent variant names that don't exist (`Button` variants are
  `default | accent | danger | subtle | ghost | link` plus their `dark-*`
  twins — see `button/button-variants.ts`; there is no `primary` or
  `outline`).
- Double-wrap form controls in a field wrapper (they already self-wrap —
  see §5).
- Reach for `asChild` on components that only accept Base UI's `render`
  prop (see §6).

Cost of reading the story: one tool call. Cost of skipping it: the
component gets rewritten after review.

---

## §1 — Commands you must use before reaching for grep

Run everything through `bun` (see root `package.json` scripts).

| Command                  | When                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `bun run storybook`      | Browse/iterate components at `localhost:6006`. Always before heavy component work. |
| `bun run storybook:test` | Verify a change didn't break a story (Vitest + Playwright browser).                |
| `bun run typecheck`      | After any `.ts/.tsx` edit. `tsc --noEmit`, no `any`, no `as`.                      |
| `bun run lint`           | Prettier + ESLint (tabs, import order, tailwind class checks).                     |
| `bun run format`         | Auto-fix formatting and lint.                                                      |
| `bun run check`          | Full gate: lint + typecheck + tests with coverage.                                 |
| `bun run build`          | Library bundle via Vite (library mode).                                            |

**Anti-pattern**: `grep -r SomeComponent packages/neob-ui/dist/`. The build
output is bundled/minified. Read the **source** under
`packages/neob-ui/src/components/ui/<name>/<name>.tsx` and its `.stories.tsx`.

**Finding a component**: the barrel `packages/neob-ui/src/index.ts` lists
every public export and its file. Start there, not with a blind grep.

---

## §2 — CSS import order is opinionated (and inverted from what you'd guess)

In this library's own `packages/neob-ui/src/index.css`:

```css
@import 'tailwindcss';          /* 1st */
@source './**/*.{ts,tsx}';      /* 2nd — scan source for class names */
@custom-variant dark (&:is(.dark *));
@theme { … }                    /* token + utility registration */
```

For a **consumer** app (per `README.md`), the `@source` must point at the
shipped bundle so Tailwind v4 emits classes that only live in compiled JS:

```css
@import 'tailwindcss';
@source "../node_modules/@joyful.tools/neob/dist/**/*.{js,cjs}";
```

`neob` declares `"sideEffects": ["**/*.css"]` (see `neob-ui/package.json`),
so importing `@joyful.tools/neob/dist/index.css` once at the app root is required and
tree-shaking-safe.

---

## §3 — Dark mode is a class ancestor, not a media query

Dark mode is driven by the `dark` custom variant:

```css
@custom-variant dark (&:is(.dark *));
```

It only activates for elements **inside** an ancestor carrying the `.dark`
class. Toggling is manual (`README.md`):

```js
document.documentElement.classList.add('dark');
```

Consequences:

- Always pair a color with its dark counterpart in component classes
  (`bg-white dark:bg-zinc`, `text-black dark:text-white`). Look at any
  existing component — this pairing is universal.
- Color tokens resolve through an HSL var indirection. `@theme` maps
  `--color-background: hsl(var(--background))`, and `@layer base` redefines
  the raw `--background` (and friends) under `:root` vs `.dark`.
- **Never** use raw Tailwind color shades (`bg-blue-500`, `text-gray-900`).
  Use curated tokens (`bg-blue`, `bg-zinc`, `text-muted-foreground`). This
  is enforced by review and by `AGENTS.md`.
- Apply `neo-theme-root` to an application shell to opt into page background,
  foreground, and font-rendering defaults. Apply `neo-app-shell` only when the
  shell intentionally needs overscroll containment.

---

## §4 — Compound components: import the parent, use the dot-API

Every multi-part component is assembled with `Object.assign` and exported as
a single namespace. Examples: `Dialog` (`dialog/dialog.tsx`), `Tabs`
(`tabs/tabs.tsx`), `Input` (`input/input.tsx`), `Table`, `Select`, etc.

```tsx
import { Tabs } from '@joyful.tools/neob';

<Tabs defaultValue="a">
  <Tabs.List variant="segmented">
    <Tabs.Trigger value="a">One</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="a">…</Tabs.Content>
</Tabs>;
```

Do **not** try to import `TabsList`/`TabsTrigger` directly — they are not
exported. Each subcomponent sets a `displayName` like `'Tabs.Trigger'` to
keep React DevTools readable; preserve this when adding subcomponents.

---

## §5 — Form controls already wrap themselves in a Field

Wrong:

```tsx
<Input.Wrapper label="Email">
  <Input value={…} onChange={…} />
</Input.Wrapper>
```

Right:

```tsx
<Input
  label="Email"
  description="We'll never share it"
  error={emailError}
  required={false}        // renders an "(optional)" hint
  labelTooltip="Why we ask"
  value={…}
  onChange={(e) => setEmail(e.target.value)}
/>
```

Any control given `label`, `description`, `error`, or `labelTooltip`
auto-constructs the `Input.Wrapper` (Base UI `Field`) internally. This is
implemented identically across `Input`, `InputArea`, `InputGroup`, `Select`,
`Combobox`, `Switch`, and `Checkbox` (search for `<Input.Wrapper` — each
file has the same `if (label || description || error || labelTooltip)`
branch).

`Input.Wrapper` is only for wrapping a **non-neob** control, or when you
need `controlFirst` layout (checkbox/switch rows). See
`input/input.stories.tsx` for the custom-control example.

---

## §6 — `render` (Base UI), not `asChild` — except `Button`

Most components are built on `@base-ui/react` and use its **`render`** prop
for polymorphism / composition, e.g. `Dialog.Content` and `Tabs.Trigger`
both forward a `render={<motion.div … />}`.

```tsx
<Dialog.Trigger render={<Button>Open</Button>} />
```

The one deliberate exception is `Button`, which exposes a convenience
`asChild` prop (`button/button.tsx`) that maps to Base UI's `render` when
`children` is a valid element. Don't assume `asChild` exists elsewhere —
check the component's props type first.

---

## §7 — Override the system as little as possible

Components encode the brutalist look through curated utility classes. Before
adding custom CSS or inline overrides:

1. Check if a variant/size prop already does it (read the `*-variants.ts` or
   the story).
2. Compose conditional classes with the `cn(...)` helper from
   `@/lib/utilities` — never hand-concatenate `className` strings. `cn`
   runs `clsx` + `tailwind-merge`, so later tokens correctly win.
3. Reach for the design tokens and functional utilities (§3, §11) before
   raw values.

Every line of bespoke CSS is a future conflict with a component update.

---

## §8 — Dev-server / preview topology for agents

- **Storybook** is the canonical iteration surface: `bun run storybook`
  serves `localhost:6006`. Configs live in `.storybook/`.
- **Tests run in a real browser**: `storybook:test` uses Vitest's Playwright
  browser provider (`@vitest/browser-playwright`). A failing interaction
  test is a real DOM failure, not a JSDOM artifact.
- **Storybook deploy** targets Cloudflare Workers via `wrangler`
  (`storybook:deploy`, `wrangler.jsonc`) — don't run it during normal dev.

Before screenshotting or asserting visuals, confirm the story renders under
both light and dark (toolbar toggle / `.dark` wrapper, see §3).

---

## §9 — Dialogs share one global backdrop; mount it once

`neob` dialogs use a single shared backdrop coordinated through a provider-scoped
stack (`dialog/dialog-stack.ts`) and rendered by `GlobalDialogBackdrop`
(`dialog/global-dialog-backdrop.tsx`). Dialog content does not render a second
visual backdrop.

Rules:

- Mount `<GlobalDialogBackdrop />` **exactly once** at the app root. Wrap independent React roots with `<DialogStackProvider>` when their dialog stacks must be isolated.
- The backdrop is always mounted and only animates opacity, so
  dialog→dialog and menu→dialog handoffs never flicker.
- Backdrop-click closes the **top** dialog via `closeTopDialog`. Dialogs
  that pass `onClose` into `useDialogStackPresence` are dismissible;
  `AlertDialog` / `ConfirmDialog` omit it on purpose and stay modal.
- `preventClose` on `Dialog` disables pointer dismissal and hides the close
  button (`dialog/dialog.tsx`).

When building a new modal-like component, register it with
`useDialogStackPresence` rather than inventing a second backdrop.

---

## §10 — React 19 + TypeScript conventions (non-negotiable)

These are enforced across the codebase and by `AGENTS.md`:

- **No `forwardRef`.** Accept `ref` as a normal prop typed
  `ref?: Ref<HTMLxElement>` (React 19 pattern). Every component does this.
- **Always set `displayName`**, namespaced for subcomponents
  (`'Dialog.Header'`).
- **No `any`, no `as` assertions.** Fully type props; derive from Base UI
  with `ComponentPropsWithoutRef<typeof Base.X>`.
- **Early returns** for guard clauses.
- **Comments explain "why", never "what".** No banner/divider comments. Do
  not add or remove comments unless the task requires it.

---

## §11 — Functional brutalist utilities (use the modifiers)

`index.css` defines parameterized `@utility` classes — not just static ones.
Prefer these over hand-rolled box-shadows / outlines:

- `shadow-cel-*` — the signature solid drop shadow. Depth via `sm | md | lg
| xl` and an optional color modifier (`shadow-cel-lg`,
  `shadow-cel-md/red`). Backed by `--shadow-cel-depth-*` tokens.
- `shadow-cel-inset-*` — pressed/inset state for buttons, inputs, meters.
- `neo-focus-ring` / `neo-focus-ring-focus` — the offset double-ring focus
  treatment. Apply to interactive elements instead of `ring-*`.
- `underline-slide-*` — hover slide underline for link-style elements.
- Animation utilities: `neo-shake`, `neo-skew`, `neo-wave`, `appear`,
  `animate-typing-indicator`, plus the `--animate-*` keyframes for
  overlay/modal/popover transitions.

Custom variants also exist: `hover-always` / `group-hover-always` apply
hover styles on touch devices that lack real hover.

---

## §12 — Bundle size & granular imports

- Public API is the barrel `index.ts`, but consumers can import per-component
  via the `"./*"` export map (`neob-ui/package.json`):
  `import { Button } from '@joyful.tools/neob/button';`. Prefer this in size-sensitive
  apps.
- React and React DOM are peer dependencies. Other runtime libraries are regular package dependencies and are externalized from the bundle, so the package manager installs one shared copy.
- Heavier components (virtualization, charts-style widgets, date pickers)
  pull more deps; lazy-load them off the critical path where possible.

---

## Quick checklist before authoring / editing a neob component

- [ ] Read the component's `*.stories.tsx` and source this session
- [ ] Used the barrel `index.ts` to locate exports (not a dist grep)
- [ ] Colors are curated tokens, each paired with a `dark:` variant — no raw
      Tailwind shades
- [ ] Conditional classes go through `cn(...)`
- [ ] Compound parts imported via the parent namespace (`Tabs.List`, not
      `TabsList`)
- [ ] Form controls use `label=`/`error=` instead of a manual
      `Input.Wrapper`
- [ ] Polymorphism uses Base UI `render` (only `Button` has `asChild`)
- [ ] `ref` is a prop, `displayName` is set, no `any`/`as`
- [ ] Brutalist styling uses `shadow-cel*` / `neo-focus-ring` utilities
- [ ] `bun run typecheck` and `bun run storybook:test` pass

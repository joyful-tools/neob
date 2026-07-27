# Using `neob`

Consumer guidance for installing, configuring, and composing the public
`@joyful.tools/neob` component API. Repository maintenance and component-authoring
rules belong in the repository's `AGENTS.md`.

## §1 — Configure Tailwind CSS

Point Tailwind v4 at the shipped bundle so it emits classes used by compiled
components:

```css
@import 'tailwindcss';
@source "../node_modules/@joyful.tools/neob/dist/**/*.{js,cjs}";
```

Import `@joyful.tools/neob/dist/index.css` once at the application root. The
stylesheet import is required for both root and granular component imports.

---

## §2 — Dark mode is a class ancestor

Dark mode is driven by the `dark` custom variant:

```css
@custom-variant dark (&:is(.dark *));
```

It only activates for elements **inside** an ancestor carrying the `.dark`
class. Toggling is manual (`README.md`):

```js
document.documentElement.classList.add('dark');
```

Apply `neo-theme-root` to an application shell to opt into the page background,
foreground, and font-rendering defaults. Apply `neo-app-shell` separately only
when the application intentionally needs overscroll containment.

---

## §3 — Use compound components through the parent API

Multi-part components are exported as a single namespace, including `Dialog`,
`Tabs`, `Input`, `Table`, and `Select`.

```tsx
import { Tabs } from '@joyful.tools/neob';

<Tabs defaultValue="a">
  <Tabs.List variant="segmented">
    <Tabs.Trigger value="a">One</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="a">…</Tabs.Content>
</Tabs>;
```

Do not import compound parts such as `TabsList` or `TabsTrigger` directly;
they are not public exports.

---

## §4 — Form controls already provide field structure

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

Controls given `label`, `description`, `error`, or `labelTooltip` provide their
field structure automatically. This applies to `Input`, `InputArea`,
`InputGroup`, `Select`, `Combobox`, `Switch`, and `Checkbox`.

`Input.Wrapper` is only for wrapping a **non-neob** control or when you need
`controlFirst` layout for checkbox and switch rows.

---

## §5 — Use `render` for composition, except on `Button`

Components that support polymorphic composition expose a `render` prop.

```tsx
<Dialog.Trigger render={<Button>Open</Button>} />
```

`Button` is the exception and exposes `asChild`. Do not assume `asChild` is
available on other components; check the public component props.

---

## §6 — Prefer public variants and tokens

Use a component's variant and size props before adding custom CSS. When an
override is necessary, prefer the published semantic color tokens and visual
utilities over raw values.

---

## §7 — Mount the global dialog backdrop once

Import and mount `<GlobalDialogBackdrop />` exactly once at the application
root:

```tsx
import { GlobalDialogBackdrop } from '@joyful.tools/neob';

<GlobalDialogBackdrop />;
```

Wrap independent React roots with `<DialogStackProvider>` only when their
dialog stacks must be isolated.

`preventClose` on `Dialog` disables pointer dismissal and hides the close
button. `AlertDialog` and `ConfirmDialog` remain modal by design.

---

## §8 — Use the published visual utilities

The stylesheet provides parameterized utilities for common visual treatments:

- `shadow-cel-*` supports `sm`, `md`, `lg`, and `xl` depths plus optional
  color modifiers such as `shadow-cel-md/red`.
- `shadow-cel-inset-*` provides pressed and inset treatments.
- `neo-focus-ring` and `neo-focus-ring-focus` provide offset focus rings.
- `underline-slide-*` provides an animated link underline.
- `neo-shake`, `neo-skew`, `neo-wave`, `appear`, and
  `animate-typing-indicator` provide reusable motion effects.

---

## §9 — Prefer granular imports for size-sensitive applications

Import components from the root package or through the per-component export
map:

```tsx
import { Button } from '@joyful.tools/neob/button';
```

React and React DOM are peer dependencies. Lazy-load heavier components when
they are not needed during initial rendering.

---

## Consumer checklist

- [ ] Import `@joyful.tools/neob/dist/index.css` once.
- [ ] Configure Tailwind's `@source` for the shipped bundle.
- [ ] Apply `neo-theme-root` when the library should style the app shell.
- [ ] Mount one `GlobalDialogBackdrop` when using dialogs.
- [ ] Import compound parts through their parent namespace.
- [ ] Use control field props instead of wrapping controls manually.

# Agent Integration Guide for "neob"

This file provides a structured technical reference for AI coding agents to integrate and consume the **neob** component library. It outlines design tokens, component schemas, path aliases, class name rules, and animations.

---

## Design System Tokens & Colors

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

## Key Tailwind Utility Classes

Always apply these custom brutalist classes when building layouts:

- `shadow-brutal` - Stark 4px solid black drop shadow.
- `shadow-brutal-sm` - 2px solid black drop shadow (ideal for tags/buttons).
- `shadow-brutal-lg` - 8px solid black drop shadow (ideal for hover states).
- `shadow-brutal-inset` - Inset shadow for active button states.
- `shadow-brutal-inset-sm` - Inset shadow for inputs/progress tracks.
- `neo-focus-ring` - Focus-visible border-offset outline animation.
- `underline-slide` - Hover slide-out underline effect for link items.

---

## Component API & Usage Cheatsheet

### Form Input Architecture

All input components (`Input`, `InputArea`, `SensitiveInput`, `InputGroup`) support an **opt-in wrapper** pattern:

- Pass `label`, `description`, `error`, `required`, `labelTooltip`, `controlFirst`, `hideLabel` directly as props.
- If any wrapper prop is provided, the component automatically wraps itself in a `Field` layout.
- If no wrapper prop is provided, the component renders **only** the raw control (no wrapping div).
- Use `containerClassName` to style the `Field` wrapper; use `className` for the raw control.
- Use `Field` / `Fieldset` directly only for custom form compositions (e.g., wrapping Select, Combobox, or groups).

```tsx
import { Input, InputArea, SensitiveInput, InputGroup, Field, Fieldset } from 'neob';

// Self-contained labeled input (no manual Field wrapper needed)
<Input label="Username" description="Choose a handle" placeholder="johndoe" />

// Self-contained labeled textarea
<InputArea label="Bio" description="Tell us about yourself" autoResize />

// Raw input without wrapper (for custom form libraries)
<Input placeholder="Bare input" />

// Field for custom compositions
<Field label="Custom Control">
  <SomeCustomComponent />
</Field>
```

### 1. Button

Variants: `default`, `accent`, `danger`, `subtle`, `ghost`, `link`, `dark-default`, `dark-accent`, `dark-subtle`, `dark-ghost`.
Sizes: `default`, `sm`, `lg`, `xl`, `icon`.

```tsx
import { Button } from 'neob';
<Button variant="accent" size="lg">
  Action
</Button>;
```

### 2. Dialog & AlertDialog

Overlay component based on Base UI. Implements AnimatePresence.

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from 'neob';

// Usage:
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Heading</DialogTitle>
      <DialogDescription>Description text</DialogDescription>
    </DialogHeader>
    <div>Main Body</div>
    <DialogFooter>
      <Button variant="subtle" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

### 3. Tooltip

Touch-gated tooltip wrapper. Touch start triggers a 700ms long press, while hover triggers immediately.

```tsx
import { Tooltip, TooltipProvider, Button } from 'neob';

// Wrap application or page in provider once:
<TooltipProvider>
  <Tooltip content="Tooltip helper text" side="top">
    <Button variant="subtle">Hover Me</Button>
  </Tooltip>
</TooltipProvider>;
```

### 4. Dropdown Menu

Base UI menu with custom spring popover translation.

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Button,
} from 'neob';

<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Labels</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={action}>Item</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

### 5. Resizable Panel

Layout pane splitter with custom drag-resizing.

```tsx
import { ResizablePanel } from 'neob';

<div className="flex h-64 border-2 border-black">
  <ResizablePanel direction="horizontal" defaultSize={200} minSize={100} maxSize={400}>
    <div>Left sidebar</div>
  </ResizablePanel>
  <div className="flex-1">Right content</div>
</div>;
```

### 6. One-Time Password Field

Coordinated verification input.

```tsx
import { OTPFieldRoot, OTPFieldInput } from 'neob';

<OTPFieldRoot length={4} value={otp} onValueChange={setOtp}>
  <OTPFieldInput index={0} />
  <OTPFieldInput index={1} />
  <OTPFieldInput index={2} />
  <OTPFieldInput index={3} />
</OTPFieldRoot>;
```

### 7. Toast Alerts

Built on Sonner.

```tsx
import { toast, Toaster } from 'neob';

// Render the <Toaster /> at root:
<Toaster />;

// Trigger:
toast.success('Successfully Saved!', { description: "All changes sync'd" });
toast.error('Failed to Connect');
```

---

## Coding Conventions

- **Ref Forwarding:** All elements support modern React 19 ref-as-prop pattern. Do NOT use `forwardRef`.
- **Early Returns:** Write early return statements for guard clauses.
- **TypeScript:** Fully typed parameters. Do NOT use `as` assertions.
- **Tailwind class merging:** Always utilize the exposed `cn(...)` utility helper when combining conditional classes dynamically.

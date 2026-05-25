# neob

**neob** is a premium, high-quality, reusable design system and React component library based on unstyled primitives from [Base UI](https://base-ui.com/) and styled in a vibrant **Neo-Brutalist** aesthetic.

It features stark black borders, high-contrast layouts, retro grid backgrounds, premium spring animations (via `motion`), and full dark/light mode support.

---

## Features

- **Base UI Integration:** Built on accessible, robust, unstyled primitives.
- **Neo-Brutalist Design:** Bold colors (orange, gold, yellow, green, red), thick black borders, stark drop shadows (`shadow-brutal`), and urban styling.
- **Interactive Componentry:** Highly tuned dialogs, popovers, custom inputs, touch-gated tooltips, dropdown menus, and resizable layout panels.
- **Full Dark Mode:** Effortless theming with class-based overrides (`.dark`).
- **Storybook Debugging:** Embedded Storybook playground for instant preview.

---

## Installation

Install `neob` and its peer dependencies via your favorite package manager:

```bash
# Using bun (recommended)
bun add neob react react-dom motion lucide-react sonner

# Using npm
npm install neob react react-dom motion lucide-react sonner
```

---

## Setup & Configuration

### 1. Import Styles

Import the precompiled library stylesheet at the root of your application (e.g. `main.tsx` or `index.tsx`):

```tsx
import 'neob/dist/index.css';
```

### 2. Configure Tailwind CSS

Since `neob` is built on Tailwind CSS v4, it automatically declares custom theme tokens and utility classes (such as `shadow-brutal` and `neo-focus-ring`). If you want to use `neob` classes inside your host application, ensure your `index.css` imports Tailwind and includes the path to `neob` source files for compiling:

```css
@import 'tailwindcss';

/* Add this line so Tailwind parses neob class names */
@source '../node_modules/neob/dist/**/*.{js,cjs}';
```

---

## Dark & Light Mode Support

`neob` features a full dark mode system powered by CSS custom variables. Dark mode is class-based and triggers automatically when the `.dark` class is applied to any parent element (usually `<html>` or `<body>`).

To toggle dark mode:

```javascript
// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');
```

When dark mode is active, the variables mapping colors (`--background`, `--foreground`, etc.) flip to a slate-dark scheme, and components automatically adapt while retaining their stark neo-brutalist borders.

---

## Usage Example

```tsx
import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, Dialog, DialogContent, DialogTitle } from 'neob';

export function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8 bg-background text-foreground min-h-screen">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to neob!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm">This component library is styled with a premium Neo-Brutalist design language.</p>

          <Button variant="accent" onClick={() => setOpen(true)}>
            Open Dialog
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Hello World!</DialogTitle>
          <p className="text-sm my-4">This is a neo-brutalist popover modal dialog.</p>
          <Button variant="default" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## Available Components

- **Layout:** `Card`, `GridBackground`, `ResizablePanel`
- **Actions:** `Button`, `Toggle`
- **Feedback:** `Spinner`, `Progress`, `Skeleton`, `ListSkeleton`, `BorderBeam`
- **Inputs:** `Input`, `Label`, `OTPFieldRoot`, `OTPFieldInput`, `RadioGroup`, `RadioGroupItem`
- **Overlays:** `Dialog`, `AlertDialog`, `Popover`, `Tooltip`, `DropdownMenu`, `toast`, `Toaster`

# neob

A React 19 component library styled in a bold Neo-Brutalist aesthetic.

neob provides accessible, design-system-compliant UI components built on [Base UI](https://base-ui.com/). It handles keyboard navigation, focus management, and ARIA attributes with high-contrast layouts, spring animations, and built-in dark/light mode support.

## Installation

Install `neob` using your favorite package manager:

```bash
# Using bun (recommended)
bun add neob

# Using npm
npm install neob

# Using pnpm
pnpm add neob
```

### Peer Dependencies

Ensure the following peer dependencies are installed:

```bash
# Using bun
bun add react react-dom motion @phosphor-icons/react sonner

# Using npm
npm install react react-dom motion @phosphor-icons/react sonner
```

## Usage

Import components and styles directly at the root of your application:

```tsx
import { Button, Card, Dialog } from 'neob';
import 'neob/dist/index.css';
```

### Granular Imports (Tree-Shaking)

To reduce your bundle size, you can import components individually:

```tsx
import { Button } from 'neob/button';
import { Card } from 'neob/card';
```

### Tailwind CSS v4 Configuration

`neob` leverages Tailwind CSS v4 for styling. To make custom `neob` CSS classes and themes available in your application, configure Tailwind to inspect the package:

```css
@import 'tailwindcss';

/* Ensure Tailwind compiles neob classes from node_modules */
@source "../node_modules/neob/dist/**/*.{js,cjs}";
```

## Dark & Light Mode

`neob` supports dynamic dark mode out-of-the-box. The dark mode theme is class-based and will activate when the `.dark` class is applied to any parent element (e.g., `<html>` or `<body>`):

```js
// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');
```

When active, color tokens automatically shift to their dark variant.

## Development & Documentation

To run the Storybook server locally for interactive documentation, testing, and component previews:

```bash
bun run storybook
```

Refer to the available package scripts for testing and linting:

```bash
bun run check        # Run linting, typechecking, and storybook tests
bun run build        # Build the library bundle
```

# @joyful.tools/neob

## 2.0.0

### Major Changes

- [`6c2fe06`](https://github.com/joyful-tools/neob/commit/6c2fe0601bb4275198fb630a2f1f74cf4faec90e) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Adopt React 19 Actions across mutation-capable components with queued optimistic updates, derived pending states, Error Boundary rollback, and Suspense-preserving transitions.

  This is a breaking API migration: replace mutation callbacks such as `onValueChange`, `onCheckedChange`, `onPressedChange`, `onConfirm`, `setPage`, `onFileDrop`, and `onComplete` with `action`. Remove `Button.isLoading` and confirmation loading props; pending state is now derived from the component or nearest form Action. For `Slider`, `NumericSlider`, and `ResizablePanel`, use `onInput` for urgent continuous feedback and `action` for committed values.

### Patch Changes

- [`6c2fe06`](https://github.com/joyful-tools/neob/commit/6c2fe0601bb4275198fb630a2f1f74cf4faec90e) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Prevent button flicker for synchronous and short Actions by preserving physical button styling and crossfading delayed pending indicators with reduced-motion support.

## 1.5.4

### Patch Changes

- [`e88ffe3`](https://github.com/joyful-tools/neob/commit/e88ffe3bfdca6218b7309991d58acfabb0559fc0) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Fix multi-select combobox input and adornment wrapping

## 1.5.3

### Patch Changes

- [`db1cbab`](https://github.com/joyful-tools/neob/commit/db1cbab66d3263ef15af8679ceb339be885c53a1) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Prevent HoverPreview popups from remaining open when the pointer moves over their exit animation.

## 1.5.2

### Patch Changes

- [`d47081f`](https://github.com/joyful-tools/neob/commit/d47081f46ef2493931f5015bd4c6e0b4511ff87b) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - fix toast text color

## 1.5.1

### Patch Changes

- [`553a0dd`](https://github.com/joyful-tools/neob/commit/553a0ddc37af07238d875d9a016a0e5073cff819) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Restore StackHeader's progressive, scroll-linked hide and reveal behavior, and allow multi-select combobox end adornments to remain inline until wrapping is necessary.

## 1.5.0

### Minor Changes

- [`ee63acc`](https://github.com/joyful-tools/neob/commit/ee63acc843885828d53d5b8976c0109aacd4f22b) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Add StackHeader, composable breadcrumb links, and extensible multi-select combobox inputs.

## 1.4.0

### Minor Changes

- [`36dd545`](https://github.com/joyful-tools/neob/commit/36dd545e60637f881a1a13b5bbe23617b5b5c545) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Add an integrated footer row to InputArea for actions alongside auto-resizing text.

## 1.3.0

### Minor Changes

- [`09da7d6`](https://github.com/joyful-tools/neob/commit/09da7d662e59b3ffe833357a86e256cc3b3833bb) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Allow inline confirmation triggers to use standard button variants, colors, and sizes while preserving consistent dark-mode borders.

## 1.2.0

### Minor Changes

- [`f0ca940`](https://github.com/joyful-tools/neob/commit/f0ca940baea41bd002be9cb8e86531a53ab7beb7) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - added slider component

### Patch Changes

- [`04d9e3b`](https://github.com/joyful-tools/neob/commit/04d9e3bd13f7a45a5470838b34c17a8eb3067e17) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Improve dark-mode contrast for highlighted menu items, pressed toggles, and hovered confirmation actions.

## 1.1.0

### Minor Changes

- [`db28b3d`](https://github.com/joyful-tools/neob/commit/db28b3d2b332749e2303eacd7e0c98c625b7800b) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Overhaul light and dark mode color themes

## 1.0.4

### Patch Changes

- [`57dafb1`](https://github.com/joyful-tools/neob/commit/57dafb1cf9f0d93e409c6917f87ea31769844379) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Use Tailwind hover variants.

## 1.0.3

### Patch Changes

- [`4a89c62`](https://github.com/joyful-tools/neob/commit/4a89c621b9dddadfc5ef44bd3ca7d308dc70d221) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Refine button and link interactions with smoother physical depth transitions, and reorganize the design system styles into focused modules.

## 1.0.2

### Patch Changes

- [`d2ba780`](https://github.com/joyful-tools/neob/commit/d2ba780bd49369e9059538538e95c9835c832592) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Include the README, usage guide, changelog, and MIT license in published packages and complete the npm package metadata.

## 1.0.1

### Patch Changes

- [`4e165bc`](https://github.com/joyful-tools/neob/commit/4e165bc35014f7647610a69a4e2d37d9a5029f92) Thanks [@TimoWilhelm](https://github.com/TimoWilhelm)! - Refresh the theme color palette

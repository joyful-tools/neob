---
'@joyful.tools/neob': major
---

Adopt React 19 Actions across mutation-capable components with queued optimistic updates, derived pending states, Error Boundary rollback, and Suspense-preserving transitions.

This is a breaking API migration: replace mutation callbacks such as `onValueChange`, `onCheckedChange`, `onPressedChange`, `onConfirm`, `setPage`, `onFileDrop`, and `onComplete` with `action`. Remove `Button.isLoading` and confirmation loading props; pending state is now derived from the component or nearest form Action. For `Slider`, `NumericSlider`, and `ResizablePanel`, use `onInput` for urgent continuous feedback and `action` for committed values.

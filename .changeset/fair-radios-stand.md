---
'@joyful.tools/neob': patch
---

Add theme-independent edge fades to Marquee, VirtualizedViewport, Table, Select, Combobox lists, and both menu variants so clipped content has a consistent visual cue. Scroll fades update only at hidden edges as content and viewport sizes change, support RTL, and can be disabled with edgeFade={false} or resized with --edge-fade-size.

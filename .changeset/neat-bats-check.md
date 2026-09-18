---
'@joyful.tools/neob': minor
---

Migrate all public date and time values to the Temporal API from `temporal-polyfill`. `DatePicker` now accepts and returns `Temporal.PlainDate`, while `HumanizedTime` accepts `Temporal.Instant`, `Temporal.ZonedDateTime`, or ISO strings and uses `Temporal.Duration` for `updateInterval`.

Consumers must replace legacy `Date` values and numeric update intervals with their Temporal equivalents. The existing react-day-picker behavior and neob styling remain unchanged through an internal compatibility bridge.

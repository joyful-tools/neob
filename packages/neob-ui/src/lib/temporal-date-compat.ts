import { Temporal } from 'temporal-polyfill';

/** Bridges Temporal values to libraries that still require the legacy Date carrier type. */
export function toLegacyDate(date: Temporal.PlainDate, timeZone = Temporal.Now.timeZoneId()): Date {
	const instant = date.toZonedDateTime(timeZone).toInstant();
	return new globalThis.Date(instant.epochMilliseconds);
}

/** Converts a legacy library callback value back into the package's Temporal model immediately. */
export function fromLegacyDate(date: Date, timeZone = Temporal.Now.timeZoneId()): Temporal.PlainDate {
	return Temporal.Instant.fromEpochMilliseconds(date.getTime()).toZonedDateTimeISO(timeZone).toPlainDate();
}

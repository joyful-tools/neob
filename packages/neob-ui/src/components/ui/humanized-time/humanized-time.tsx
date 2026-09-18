import { TimeHTMLAttributes, useEffect, useMemo, useState } from 'react';
import { Temporal } from 'temporal-polyfill';

import { Tooltip } from '@/components/ui/tooltip';

export type HumanizedTimeValue = Temporal.Instant | Temporal.ZonedDateTime | string;

export interface HumanizedTimeProps extends TimeHTMLAttributes<HTMLTimeElement> {
	readonly date?: HumanizedTimeValue;
	readonly updateInterval?: Temporal.Duration;
	readonly locale?: string;
	readonly placement?: 'top' | 'right' | 'bottom' | 'left';
	readonly timeZone?: string;
}

const DEFAULT_UPDATE_INTERVAL = Temporal.Duration.from({ minutes: 1 });

function toInstant(dateInput: HumanizedTimeValue): Temporal.Instant {
	if (dateInput instanceof Temporal.Instant) return dateInput;
	if (dateInput instanceof Temporal.ZonedDateTime) return dateInput.toInstant();
	return Temporal.Instant.from(dateInput);
}

export function getHumanizedTimeString(dateInput: HumanizedTimeValue, locale = 'en'): string {
	const target = toInstant(dateInput);
	const diffSeconds = Math.round(target.since(Temporal.Now.instant()).total({ unit: 'seconds' }));
	const relativeTime = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

	const absoluteSeconds = Math.abs(diffSeconds);
	if (absoluteSeconds < 60) return relativeTime.format(diffSeconds, 'second');

	const diffMinutes = Math.round(diffSeconds / 60);
	if (Math.abs(diffMinutes) < 60) return relativeTime.format(diffMinutes, 'minute');

	const diffHours = Math.round(diffMinutes / 60);
	if (Math.abs(diffHours) < 24) return relativeTime.format(diffHours, 'hour');

	const diffDays = Math.round(diffHours / 24);
	if (Math.abs(diffDays) < 7) return relativeTime.format(diffDays, 'day');

	const diffWeeks = Math.round(diffDays / 7);
	if (Math.abs(diffWeeks) < 4) return relativeTime.format(diffWeeks, 'week');

	const diffMonths = Math.round(diffDays / 30);
	if (Math.abs(diffMonths) < 12) return relativeTime.format(diffMonths, 'month');

	return relativeTime.format(Math.round(diffDays / 365), 'year');
}

export function getFullDateTimeString(dateInput: HumanizedTimeValue, locale = 'en', timeZone = Temporal.Now.timeZoneId()): string {
	return toInstant(dateInput).toLocaleString(locale, {
		dateStyle: 'full',
		timeStyle: 'medium',
		timeZone,
	});
}

/** Displays a locale-aware relative time with the absolute timestamp in a tooltip. */
export function HumanizedTime({
	date,
	updateInterval = DEFAULT_UPDATE_INTERVAL,
	locale = 'en',
	placement = 'top',
	timeZone,
	...properties
}: HumanizedTimeProps) {
	const [lastDate, setLastDate] = useState(date);
	const [lastLocale, setLastLocale] = useState(locale);
	const [relativeTime, setRelativeTime] = useState(() => (date === undefined ? '' : getHumanizedTimeString(date, locale)));

	if (date !== lastDate || locale !== lastLocale) {
		setLastDate(date);
		setLastLocale(locale);
		setRelativeTime(date === undefined ? '' : getHumanizedTimeString(date, locale));
	}

	const fullDateTime = useMemo(() => (date === undefined ? '' : getFullDateTimeString(date, locale, timeZone)), [date, locale, timeZone]);
	const datetimeAttribute = useMemo(() => (date === undefined ? '' : toInstant(date).toString()), [date]);
	const intervalMilliseconds = useMemo(() => Math.max(1000, updateInterval.total({ unit: 'milliseconds' })), [updateInterval]);

	useEffect(() => {
		if (date === undefined) return;

		let timer: ReturnType<typeof setInterval> | undefined;
		const update = () => setRelativeTime(getHumanizedTimeString(date, locale));
		const updateTimer = () => {
			clearInterval(timer);
			if (!document.hidden) {
				update();
				timer = setInterval(update, intervalMilliseconds);
			}
		};

		updateTimer();
		document.addEventListener('visibilitychange', updateTimer);
		return () => {
			clearInterval(timer);
			document.removeEventListener('visibilitychange', updateTimer);
		};
	}, [date, locale, intervalMilliseconds]);

	if (date === undefined) return null;

	return (
		<Tooltip content={fullDateTime} side={placement}>
			<time dateTime={datetimeAttribute} {...properties}>
				{relativeTime}
			</time>
		</Tooltip>
	);
}

HumanizedTime.displayName = 'HumanizedTime';

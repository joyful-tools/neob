import { TimeHTMLAttributes, useEffect, useMemo, useState } from 'react';

import { Tooltip } from '@/components/ui/tooltip';

export interface HumanizedTimeProps extends TimeHTMLAttributes<HTMLTimeElement> {
	readonly date?: Date | number | string;
	readonly updateInterval?: number | { total: (options: { unit: 'milliseconds' }) => number };
	readonly locale?: string;
	readonly placement?: 'top' | 'right' | 'bottom' | 'left';
}

export function getHumanizedTimeString(dateInput: Date | number | string, locale = 'en'): string {
	const date = new Date(dateInput);
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	const diffSecs = Math.round(diffMs / 1000);

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

	const absSecs = Math.abs(diffSecs);
	if (absSecs < 60) {
		return rtf.format(diffSecs, 'second');
	}

	const diffMins = Math.round(diffSecs / 60);
	const absMins = Math.abs(diffMins);
	if (absMins < 60) {
		return rtf.format(diffMins, 'minute');
	}

	const diffHours = Math.round(diffMins / 60);
	const absHours = Math.abs(diffHours);
	if (absHours < 24) {
		return rtf.format(diffHours, 'hour');
	}

	const diffDays = Math.round(diffHours / 24);
	const absDays = Math.abs(diffDays);
	if (absDays < 7) {
		return rtf.format(diffDays, 'day');
	}

	const diffWeeks = Math.round(diffDays / 7);
	const absWeeks = Math.abs(diffWeeks);
	if (absWeeks < 4) {
		return rtf.format(diffWeeks, 'week');
	}

	const diffMonths = Math.round(diffDays / 30);
	const absMonths = Math.abs(diffMonths);
	if (absMonths < 12) {
		return rtf.format(diffMonths, 'month');
	}

	const diffYears = Math.round(diffDays / 365);
	return rtf.format(diffYears, 'year');
}

export function getFullDateTimeString(dateInput: Date | number | string, locale = 'en'): string {
	const date = new Date(dateInput);
	return new Intl.DateTimeFormat(locale, {
		dateStyle: 'full',
		timeStyle: 'medium',
	}).format(date);
}

/**
 * HumanizedTime component.
 * Displays relative time in a <time> element, wrapped in a Tooltip showing the full absolute date.
 */
export function HumanizedTime({ date, updateInterval = 60_000, locale = 'en', placement = 'top', ...properties }: HumanizedTimeProps) {
	const [lastDate, setLastDate] = useState(date);
	const [relativeTime, setRelativeTime] = useState(() => (date ? getHumanizedTimeString(date, locale) : ''));

	// Sync state when date prop changes during rendering (React-recommended pattern)
	if (date !== lastDate) {
		setLastDate(date);
		setRelativeTime(date ? getHumanizedTimeString(date, locale) : '');
	}

	const fullDateTime = useMemo(() => (date ? getFullDateTimeString(date, locale) : ''), [date, locale]);
	const datetimeAttribute = useMemo(() => {
		if (!date) return '';
		const parsedDate = new Date(date);
		return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString();
	}, [date]);

	const intervalMs = useMemo(() => {
		if (typeof updateInterval === 'number') {
			return updateInterval;
		}
		if (updateInterval && typeof updateInterval.total === 'function') {
			return updateInterval.total({ unit: 'milliseconds' });
		}
		return 60_000;
	}, [updateInterval]);

	useEffect(() => {
		if (!date) return;

		const timer = setInterval(() => {
			setRelativeTime(getHumanizedTimeString(date, locale));
		}, intervalMs);

		return () => clearInterval(timer);
	}, [date, locale, intervalMs]);

	if (!date) {
		return null;
	}

	return (
		<Tooltip content={fullDateTime} side={placement}>
			<time dateTime={datetimeAttribute} {...properties}>
				{relativeTime}
			</time>
		</Tooltip>
	);
}
HumanizedTime.displayName = 'HumanizedTime';

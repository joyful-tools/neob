/* eslint-disable better-tailwindcss/no-unknown-classes, @typescript-eslint/no-unsafe-function-type */
import { CaretDown, CaretLeft, CaretRight, CaretUp } from '@phosphor-icons/react';
import * as React from 'react';
import {
	DayPicker,
	type CustomComponents,
	type PropsBase,
	type PropsSingle,
	type PropsSingleRequired,
	type PropsMulti,
	type PropsMultiRequired,
	type PropsRange,
	type PropsRangeRequired,
	type Modifiers,
} from 'react-day-picker';

import { cn } from '@/lib/utilities';

import { Button } from './button';

/**
 * Custom Chevron component using Phosphor icons
 */
const Chevron: CustomComponents['Chevron'] = ({ orientation, ...props }) => {
	const Icon = orientation === 'left' ? CaretLeft : orientation === 'right' ? CaretRight : orientation === 'up' ? CaretUp : CaretDown;
	return <Icon size={14} {...props} />;
};

/** Base props shared across all DatePicker modes */
type BaseProps = Omit<PropsBase, 'classNames'> & {
	/** Additional CSS classes merged via `cn()`. */
	className?: string;
	/** Custom class names for internal elements */
	classNames?: PropsBase['classNames'];
};

/** Single date selection (optional) */
type SingleProps = BaseProps &
	Omit<PropsSingle, 'onSelect' | 'classNames'> & {
		onChange?: PropsSingle['onSelect'];
	};

/** Single date selection (required) */
type SingleRequiredProps = BaseProps &
	Omit<PropsSingleRequired, 'onSelect' | 'classNames'> & {
		onChange?: PropsSingleRequired['onSelect'];
	};

/** Multiple date selection (optional) */
type MultipleProps = BaseProps &
	Omit<PropsMulti, 'onSelect' | 'classNames'> & {
		onChange?: PropsMulti['onSelect'];
	};

/** Multiple date selection (required) */
type MultipleRequiredProps = BaseProps &
	Omit<PropsMultiRequired, 'onSelect' | 'classNames'> & {
		onChange?: PropsMultiRequired['onSelect'];
	};

/** Date range selection (optional) */
type RangeProps = BaseProps &
	Omit<PropsRange, 'onSelect' | 'classNames'> & {
		onChange?: PropsRange['onSelect'];
	};

/** Date range selection (required) */
type RangeRequiredProps = BaseProps &
	Omit<PropsRangeRequired, 'onSelect' | 'classNames'> & {
		onChange?: PropsRangeRequired['onSelect'];
	};

export type DatePickerProps = SingleProps | SingleRequiredProps | MultipleProps | MultipleRequiredProps | RangeProps | RangeRequiredProps;

/**
 * Helper function to safely execute callback without TS union-invocation errors.
 */
function invokeCallback(
	fn: Function,
	selected: Date | Date[] | import('react-day-picker').DateRange | undefined,
	triggerDate: Date,
	modifiers: Modifiers,
	e: React.MouseEvent | React.KeyboardEvent,
) {
	fn(selected, triggerDate, modifiers, e);
}

/**
 * DatePicker — a brutalist date selection calendar.
 *
 * Built on [react-day-picker](https://daypicker.dev) with custom neob styling.
 * Supports three selection modes: single, multiple, and range.
 *
 * @example
 * ```tsx
 * // Single date selection
 * const [date, setDate] = useState<Date>();
 * <DatePicker mode="single" selected={date} onChange={setDate} />
 *
 * // Multiple date selection
 * const [dates, setDates] = useState<Date[]>([]);
 * <DatePicker mode="multiple" selected={dates} onChange={setDates} max={5} />
 *
 * // Date range selection
 * const [range, setRange] = useState<DateRange>();
 * <DatePicker mode="range" selected={range} onChange={setRange} numberOfMonths={2} />
 * ```
 */
export function DatePicker(fullProps: DatePickerProps) {
	const { className, classNames, components, fixedWeeks = true } = fullProps;

	// View state: 'days' | 'months' | 'years'
	const [view, setView] = React.useState<'days' | 'months' | 'years'>('days');

	// Selected displayed month tracking (controlled or uncontrolled fallback)
	const [internalMonth, setInternalMonth] = React.useState<Date>(() => {
		const sel = fullProps.selected;
		if (sel) {
			if (sel instanceof Date) {
				return sel;
			}
			if (Array.isArray(sel) && sel[0] instanceof Date) {
				return sel[0];
			}
			if (typeof sel === 'object' && 'from' in sel && sel.from instanceof Date) {
				return sel.from;
			}
		}
		return fullProps.defaultMonth || new Date();
	});

	const displayedMonth = fullProps.month || internalMonth;

	// Page starting year for Year grid selection
	const [yearsStart, setYearsStart] = React.useState<number>(displayedMonth.getFullYear() - 4);

	const handleMonthChange = (newMonth: Date) => {
		setInternalMonth(newMonth);
		fullProps.onMonthChange?.(newMonth);
	};

	const monthLabel = displayedMonth.toLocaleString('default', { month: 'long' });
	const yearLabel = displayedMonth.getFullYear().toString();

	const handlePrevClick = () => {
		switch (view) {
			case 'days': {
				handleMonthChange(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1));

				break;
			}
			case 'months': {
				handleMonthChange(new Date(displayedMonth.getFullYear() - 1, displayedMonth.getMonth()));

				break;
			}
			case 'years': {
				setYearsStart((prev) => prev - 12);

				break;
			}
			// No default
		}
	};

	const handleNextClick = () => {
		switch (view) {
			case 'days': {
				handleMonthChange(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1));

				break;
			}
			case 'months': {
				handleMonthChange(new Date(displayedMonth.getFullYear() + 1, displayedMonth.getMonth()));

				break;
			}
			case 'years': {
				setYearsStart((prev) => prev + 12);

				break;
			}
			// No default
		}
	};

	// Stable dimensions: Width expanded to 312px and Height expanded to 376px to prevent overflow
	const containerClassName = cn(
		'rdp-root relative box-border flex h-[376px] w-[312px] flex-col justify-between rounded-xl border-2 border-black bg-white p-4 text-black shadow-sm select-none dark:border-black dark:bg-zinc dark:text-white',
		className,
	);

	const renderDays = () => {
		const dayPickerProps = {
			showOutsideDays: true,
			fixedWeeks,
			month: displayedMonth,
			onMonthChange: handleMonthChange,
			hideNavigation: true,
			disableNavigation: true,
			classNames: {
				root: 'w-full h-full flex flex-col justify-between',
				months: 'flex flex-col sm:flex-row gap-4 flex-1 justify-between',
				month: 'space-y-4 relative flex-1 flex flex-col justify-between',
				month_caption: 'hidden',
				month_grid: 'w-full border-collapse space-y-1 flex-1',
				weekdays: 'flex justify-between w-full',
				weekday:
					'text-xs font-black tracking-wider text-muted-foreground dark:text-white/80 w-9 h-9 flex items-center justify-center uppercase',
				weeks: 'space-y-1 mt-1 flex-1 flex flex-col justify-between',
				week: 'flex w-full mt-1 justify-between',
				day: 'h-9 w-9 p-0 relative flex items-center justify-center',
				day_button:
					'cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border-2 border-transparent text-sm font-bold text-black transition-all duration-200 select-none hover:bg-black/10 hover:border-black dark:text-white dark:hover:bg-white/10 dark:hover:border-black focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white',
				today: '[&_button]:border-2 [&_button]:border-dashed [&_button]:border-black dark:[&_button]:border-black',
				selected:
					'[&_button]:bg-orange [&_button]:text-black [&_button]:border-2 [&_button]:border-black dark:[&_button]:bg-orange dark:[&_button]:text-black dark:[&_button]:border-black hover:[&_button]:bg-orange/90',
				range_start:
					'rounded-lg bg-orange/20 dark:bg-orange/15 [&_button]:bg-orange [&_button]:text-black [&_button]:border-2 [&_button]:border-black dark:[&_button]:border-black',
				range_end:
					'rounded-lg bg-orange/20 dark:bg-orange/15 [&_button]:bg-orange [&_button]:text-black [&_button]:border-2 [&_button]:border-black dark:[&_button]:border-black',
				range_middle:
					'bg-orange/20 dark:bg-orange/15 [&_button]:border-transparent [&_button]:rounded-none [&_button]:bg-transparent dark:[&_button]:bg-transparent [&_button]:text-black dark:[&_button]:text-white',
				outside: 'text-black/65 dark:text-white/65 opacity-100',
				disabled: 'text-muted-foreground opacity-30 cursor-not-allowed pointer-events-none',
				...classNames,
			},
			components: {
				Chevron,
				...components,
			},
		};

		if (fullProps.mode === 'single') {
			const { className: _, classNames: __, components: ___, onChange, ...singleProps } = fullProps;
			const handleSelect = (
				selected: Date | undefined,
				triggerDate: Date,
				modifiers: Modifiers,
				e: React.MouseEvent | React.KeyboardEvent,
			) => {
				if (onChange) {
					invokeCallback(onChange, selected, triggerDate, modifiers, e);
				}
			};
			return <DayPicker {...dayPickerProps} {...singleProps} mode="single" onSelect={handleSelect} />;
		}

		if (fullProps.mode === 'multiple') {
			const { className: _, classNames: __, components: ___, onChange, ...multiProps } = fullProps;
			const handleSelect = (
				selected: Date[] | undefined,
				triggerDate: Date,
				modifiers: Modifiers,
				e: React.MouseEvent | React.KeyboardEvent,
			) => {
				if (onChange) {
					invokeCallback(onChange, selected, triggerDate, modifiers, e);
				}
			};
			return <DayPicker {...dayPickerProps} {...multiProps} mode="multiple" onSelect={handleSelect} />;
		}

		if (fullProps.mode === 'range') {
			const { className: _, classNames: __, components: ___, onChange, ...rangeProps } = fullProps;
			const handleSelect = (
				selected: import('react-day-picker').DateRange | undefined,
				triggerDate: Date,
				modifiers: Modifiers,
				e: React.MouseEvent | React.KeyboardEvent,
			) => {
				if (onChange) {
					invokeCallback(onChange, selected, triggerDate, modifiers, e);
				}
			};
			return <DayPicker {...dayPickerProps} {...rangeProps} mode="range" onSelect={handleSelect} />;
		}

		return null;
	};

	const renderMonths = () => {
		const year = displayedMonth.getFullYear();
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		return (
			<div className="box-border grid h-[276px] flex-1 grid-cols-3 items-center gap-2 py-1">
				{months.map((monthName, idx) => {
					const isSelected = displayedMonth.getMonth() === idx;
					return (
						<Button
							key={monthName}
							type="button"
							variant={isSelected ? 'accent' : 'subtle'}
							onClick={() => {
								handleMonthChange(new Date(year, idx));
								setView('days');
							}}
							className={cn('h-12 w-full text-sm', isSelected && 'text-black dark:text-black')}
						>
							{monthName.toUpperCase()}
						</Button>
					);
				})}
			</div>
		);
	};

	const renderYears = () => {
		const currentYear = displayedMonth.getFullYear();
		const years = Array.from({ length: 12 }, (_, i) => yearsStart + i);

		return (
			<div className="box-border grid h-[276px] flex-1 grid-cols-3 items-center gap-2 py-1">
				{years.map((y) => {
					const isSelected = currentYear === y;
					return (
						<Button
							key={y}
							type="button"
							variant={isSelected ? 'accent' : 'subtle'}
							onClick={() => {
								handleMonthChange(new Date(y, displayedMonth.getMonth()));
								setView('days');
							}}
							className={cn('h-12 w-full text-sm', isSelected && 'text-black dark:text-black')}
						>
							{y}
						</Button>
					);
				})}
			</div>
		);
	};

	return (
		<div className={containerClassName}>
			<div className="flex h-10 items-center justify-between border-b border-black/5 pb-2 dark:border-white/5">
				<div className="flex items-center gap-1.5 font-sans text-lg font-bold tracking-wider text-black uppercase dark:text-white">
					<button
						type="button"
						onClick={() => setView(view === 'months' ? 'days' : 'months')}
						className={cn(
							'cursor-pointer rounded-sm px-1.5 py-0.5 transition-colors select-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-hidden dark:hover:bg-white/10 dark:focus-visible:ring-white',
							view === 'months' && 'bg-black/5 dark:bg-white/10',
						)}
					>
						{monthLabel}
					</button>
					<span className="text-black/40 dark:text-white/40">/</span>
					<button
						type="button"
						onClick={() => {
							setYearsStart(displayedMonth.getFullYear() - 4);
							setView(view === 'years' ? 'days' : 'years');
						}}
						className={cn(
							'cursor-pointer rounded-sm px-1.5 py-0.5 transition-colors select-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-hidden dark:hover:bg-white/10 dark:focus-visible:ring-white',
							view === 'years' && 'bg-black/5 dark:bg-white/10',
						)}
					>
						{yearLabel}
					</button>
				</div>
				<div className="z-10 flex items-center gap-1">
					<Button
						type="button"
						variant="subtle"
						size="icon"
						onClick={handlePrevClick}
						aria-label={view === 'days' ? 'Previous month' : view === 'months' ? 'Previous year' : 'Previous years'}
						className="size-7 rounded-md"
					>
						<CaretLeft size={14} />
					</Button>
					<Button
						type="button"
						variant="subtle"
						size="icon"
						onClick={handleNextClick}
						aria-label={view === 'days' ? 'Next month' : view === 'months' ? 'Next year' : 'Next years'}
						className="size-7 rounded-md"
					>
						<CaretRight size={14} />
					</Button>
				</div>
			</div>

			{/* Views Content Grid */}
			<div className="flex flex-1 flex-col justify-between">
				{view === 'days' && renderDays()}
				{view === 'months' && renderMonths()}
				{view === 'years' && renderYears()}
			</div>
		</div>
	);
}

DatePicker.displayName = 'DatePicker';

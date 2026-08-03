/* eslint-disable better-tailwindcss/no-unknown-classes, @typescript-eslint/no-unsafe-function-type */
import { CaretDownIcon, CaretLeftIcon, CaretRightIcon, CaretUpIcon } from '@phosphor-icons/react';
import { useDrag } from '@use-gesture/react';
import { AnimatePresence, motion } from 'motion/react';
import { KeyboardEvent, MouseEvent, useState } from 'react';
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

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utilities';

/**
 * Custom Chevron component using Phosphor icons
 */
const Chevron: CustomComponents['Chevron'] = ({ orientation, ...props }) => {
	const Icon =
		orientation === 'left' ? CaretLeftIcon : orientation === 'right' ? CaretRightIcon : orientation === 'up' ? CaretUpIcon : CaretDownIcon;
	return <Icon size={14} {...props} />;
};

const fadeTransition = {
	duration: 0.05,
	ease: 'easeOut',
} as const;

const slideTransition = {
	type: 'spring',
	stiffness: 720,
	damping: 40,
	mass: 0.55,
} as const;

const layoutTransition = {
	type: 'spring',
	stiffness: 540,
	damping: 38,
	mass: 0.7,
} as const;

type PageDirection = 'forward' | 'backward' | 'none';

/** Minimum horizontal drag distance (px) to commit a swipe navigation. */
const SWIPE_DISTANCE_THRESHOLD = 60;
/** Minimum fling velocity (px/ms) to commit a swipe with a shorter drag distance. */
const SWIPE_VELOCITY_THRESHOLD = 0.5;

const bodyVariants = {
	enter: (direction: PageDirection) => {
		if (direction === 'forward') {
			return { opacity: 0, x: 12, transition: slideTransition };
		}

		if (direction === 'backward') {
			return { opacity: 0, x: -12, transition: slideTransition };
		}

		return { opacity: 0, transition: fadeTransition };
	},
	center: {
		opacity: 1,
		x: 0,
	},
	exit: (direction: PageDirection) => {
		if (direction === 'forward') {
			return { opacity: 0, x: -12, transition: slideTransition };
		}

		if (direction === 'backward') {
			return { opacity: 0, x: 12, transition: slideTransition };
		}

		return { opacity: 0, transition: fadeTransition };
	},
} as const;

function getFadeMotion() {
	return {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	} as const;
}

const SELECTED_DAY_BUTTON_CLASSES =
	'[&_button]:relative [&_button]:z-10 [&_button]:border-2 [&_button]:border-edge [&_button]:bg-cyan [&_button]:text-black dark:[&_button]:bg-cyan-dark dark:[&_button]:text-white hover:[&_button]:bg-cyan/90 dark:hover:[&_button]:bg-cyan-dark/90';

const RANGE_INDICATOR_BASE =
	"before:absolute before:inset-y-px before:z-0 before:bg-cyan/30 dark:before:bg-cyan/25 before:content-[''] before:transition-all before:duration-50";

const DAY_PICKER_BASE_CLASSNAMES = {
	root: 'w-full h-full flex flex-col justify-between',
	months: 'flex flex-col sm:flex-row gap-4 flex-1 justify-between',
	month: 'space-y-4 relative flex-1 flex flex-col justify-between',
	month_caption: 'hidden',
	month_grid: 'w-full border-collapse space-y-1 flex-1',
	weekdays: 'flex w-full',
	weekday:
		'text-xs font-black tracking-wider text-muted-foreground dark:text-white/80 flex-1 h-9 flex items-center justify-center uppercase',
	weeks: 'space-y-1 mt-1 flex-1 flex flex-col justify-between',
	week: 'flex w-full mt-1',
	day: 'h-9 flex-1 p-0 relative flex items-center justify-center',
	day_button: cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-md size-9 rounded-lg tracking-wide'),
	today: '[&_button]:border-2 [&_button]:border-dashed [&_button]:border-edge font-extrabold',
	selected: SELECTED_DAY_BUTTON_CLASSES,
	range_middle: cn(
		"before:absolute before:inset-x-0 before:inset-y-px before:z-0 before:bg-cyan/30 before:transition-all before:duration-50 before:content-[''] dark:before:bg-cyan/25",
		'first:before:rounded-l-lg last:before:rounded-r-lg',
		'[&_button]:relative [&_button]:z-10',
		'hover:[&_button]:bg-cyan/20 dark:hover:[&_button]:bg-cyan/20',
	),
	outside: 'text-muted-foreground opacity-100',
	disabled: 'text-muted-foreground opacity-30 cursor-not-allowed pointer-events-none [&_button]:pointer-events-none',
} as const;

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
	e: MouseEvent | KeyboardEvent,
) {
	fn(selected, triggerDate, modifiers, e);
}

/**
 * DatePicker — a date selection calendar with high-contrast styling.
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

	const [view, setView] = useState<'days' | 'months' | 'years'>('days');
	const [pageDirection, setPageDirection] = useState<PageDirection>('none');

	// Selected displayed month tracking (controlled or uncontrolled fallback)
	const [internalMonth, setInternalMonth] = useState<Date>(() => {
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
	const [yearsStart, setYearsStart] = useState<number>(displayedMonth.getFullYear() - 4);

	const handleMonthChange = (newMonth: Date) => {
		setInternalMonth(newMonth);
		fullProps.onMonthChange?.(newMonth);
	};

	const changeView = (nextView: 'days' | 'months' | 'years') => {
		setPageDirection('none');
		setView(nextView);
	};

	const monthLabel = displayedMonth.toLocaleString('default', { month: 'long' });
	const yearLabel = displayedMonth.getFullYear().toString();

	const handlePrevClick = () => {
		switch (view) {
			case 'days': {
				setPageDirection('backward');
				handleMonthChange(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1));

				break;
			}
			case 'months': {
				setPageDirection('backward');
				handleMonthChange(new Date(displayedMonth.getFullYear() - 1, displayedMonth.getMonth()));

				break;
			}
			case 'years': {
				setPageDirection('backward');
				setYearsStart((prev) => prev - 12);

				break;
			}
			// No default
		}
	};

	const handleNextClick = () => {
		switch (view) {
			case 'days': {
				setPageDirection('forward');
				handleMonthChange(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1));

				break;
			}
			case 'months': {
				setPageDirection('forward');
				handleMonthChange(new Date(displayedMonth.getFullYear() + 1, displayedMonth.getMonth()));

				break;
			}
			case 'years': {
				setPageDirection('forward');
				setYearsStart((prev) => prev + 12);

				break;
			}
			// No default
		}
	};

	const bindSwipe = useDrag(
		({ last, axis, movement: [mx], velocity: [vx], direction: [dx] }) => {
			if (!last || axis !== 'x') {
				return;
			}

			const flung = vx > SWIPE_VELOCITY_THRESHOLD && Math.abs(mx) > SWIPE_DISTANCE_THRESHOLD / 2;
			const swipedLeft = mx < -SWIPE_DISTANCE_THRESHOLD || (flung && dx < 0);
			const swipedRight = mx > SWIPE_DISTANCE_THRESHOLD || (flung && dx > 0);

			if (swipedLeft) {
				handleNextClick();
				return;
			}

			if (swipedRight) {
				handlePrevClick();
			}
		},
		{ axis: 'x', pointer: { touch: true } },
	);

	const containerClassName = cn(
		'rdp-root relative box-border flex h-94 w-78 flex-col justify-between rounded-xl border-2 border-edge bg-white p-4 text-black shadow-sm select-none dark:bg-zinc dark:text-white',
		className,
	);

	const renderDays = () => {
		const isMultiDayRange = Boolean(
			fullProps.mode === 'range' &&
			fullProps.selected?.from &&
			fullProps.selected?.to &&
			fullProps.selected.from.toDateString() !== fullProps.selected.to.toDateString(),
		);

		const startButtonRadius = isMultiDayRange ? '[&_button]:rounded-l-lg [&_button]:rounded-r-sm' : '[&_button]:rounded-lg';
		const endButtonRadius = isMultiDayRange ? '[&_button]:rounded-r-lg [&_button]:rounded-l-sm' : '[&_button]:rounded-lg';

		const startRangeIndicator = isMultiDayRange ? cn(RANGE_INDICATOR_BASE, 'before:right-0 before:left-[calc(50%+16px)]') : '';
		const endRangeIndicator = isMultiDayRange ? cn(RANGE_INDICATOR_BASE, 'before:right-[calc(50%+16px)] before:left-0') : '';

		const selectedClass = fullProps.mode === 'range' ? '' : SELECTED_DAY_BUTTON_CLASSES;

		const dayPickerProps = {
			showOutsideDays: true,
			fixedWeeks,
			month: displayedMonth,
			onMonthChange: handleMonthChange,
			hideNavigation: true,
			disableNavigation: true,
			classNames: {
				...DAY_PICKER_BASE_CLASSNAMES,
				selected: selectedClass,
				range_start: cn('relative z-10', SELECTED_DAY_BUTTON_CLASSES, startButtonRadius, startRangeIndicator),
				range_end: cn('relative z-10', SELECTED_DAY_BUTTON_CLASSES, endButtonRadius, endRangeIndicator),
				...classNames,
			},
			components: {
				Chevron,
				...components,
			},
		};

		if (fullProps.mode === 'single') {
			const { className: _, classNames: __, components: ___, onChange, ...singleProps } = fullProps;
			return (
				<DayPicker
					{...dayPickerProps}
					{...singleProps}
					mode="single"
					onSelect={(selected: Date | undefined, triggerDate: Date, modifiers: Modifiers, e: MouseEvent | KeyboardEvent) => {
						if (onChange) {
							invokeCallback(onChange, selected, triggerDate, modifiers, e);
						}
					}}
				/>
			);
		}

		if (fullProps.mode === 'multiple') {
			const { className: _, classNames: __, components: ___, onChange, ...multiProps } = fullProps;
			return (
				<DayPicker
					{...dayPickerProps}
					{...multiProps}
					mode="multiple"
					onSelect={(selected: Date[] | undefined, triggerDate: Date, modifiers: Modifiers, e: MouseEvent | KeyboardEvent) => {
						if (onChange) {
							invokeCallback(onChange, selected, triggerDate, modifiers, e);
						}
					}}
				/>
			);
		}

		if (fullProps.mode === 'range') {
			const { className: _, classNames: __, components: ___, onChange, ...rangeProps } = fullProps;
			return (
				<DayPicker
					{...dayPickerProps}
					{...rangeProps}
					mode="range"
					onSelect={(
						selected: import('react-day-picker').DateRange | undefined,
						triggerDate: Date,
						modifiers: Modifiers,
						e: MouseEvent | KeyboardEvent,
					) => {
						if (onChange) {
							invokeCallback(onChange, selected, triggerDate, modifiers, e);
						}
					}}
				/>
			);
		}

		return null;
	};

	const renderMonths = () => {
		const year = displayedMonth.getFullYear();
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		return (
			<div className="box-border grid h-69 flex-1 grid-cols-3 items-center gap-2 py-1">
				{months.map((monthName, idx) => {
					const isSelected = displayedMonth.getMonth() === idx;
					return (
						<Button
							key={monthName}
							type="button"
							variant={isSelected ? 'subtle-accent' : 'subtle'}
							onClick={() => {
								changeView('days');
								handleMonthChange(new Date(year, idx));
							}}
							className="h-12 w-full text-sm"
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
			<div className="box-border grid h-69 flex-1 grid-cols-3 items-center gap-2 py-1">
				{years.map((y) => {
					const isSelected = currentYear === y;
					return (
						<Button
							key={y}
							type="button"
							variant={isSelected ? 'subtle-accent' : 'subtle'}
							onClick={() => {
								changeView('days');
								handleMonthChange(new Date(y, displayedMonth.getMonth()));
							}}
							className="h-12 w-full text-sm"
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
			<div className="flex h-10 items-center justify-between border-b border-edge/5 pb-2">
				<div className="flex min-w-0 items-center gap-1 font-sans text-lg font-bold tracking-wider text-black uppercase dark:text-white">
					<AnimatePresence mode="popLayout" initial={false}>
						<motion.button
							key={`header-month-${monthLabel}`}
							type="button"
							onClick={() => changeView(view === 'months' ? 'days' : 'months')}
							{...getFadeMotion()}
							transition={fadeTransition}
							aria-pressed={view === 'months'}
							className={cn(
								buttonVariants({ variant: 'ghost', size: 'sm' }),
								'max-w-32 px-1.5 text-lg tracking-wider',
								view === 'months' && 'bg-black/5 dark:bg-white/10',
							)}
						>
							<span className="truncate">{monthLabel}</span>
						</motion.button>
					</AnimatePresence>
					<span className="shrink-0 text-black/40 dark:text-white/40">/</span>
					<AnimatePresence mode="popLayout" initial={false}>
						<motion.button
							key={`header-year-${yearLabel}`}
							type="button"
							onClick={() => {
								setYearsStart(displayedMonth.getFullYear() - 4);
								changeView(view === 'years' ? 'days' : 'years');
							}}
							{...getFadeMotion()}
							transition={fadeTransition}
							aria-pressed={view === 'years'}
							className={cn(
								buttonVariants({ variant: 'ghost', size: 'sm' }),
								'max-w-20 px-1.5 text-lg tracking-wider',
								view === 'years' && 'bg-black/5 dark:bg-white/10',
							)}
						>
							<span className="truncate">{yearLabel}</span>
						</motion.button>
					</AnimatePresence>
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
						<CaretLeftIcon size={14} />
					</Button>
					<Button
						type="button"
						variant="subtle"
						size="icon"
						onClick={handleNextClick}
						aria-label={view === 'days' ? 'Next month' : view === 'months' ? 'Next year' : 'Next years'}
						className="size-7 rounded-md"
					>
						<CaretRightIcon size={14} />
					</Button>
				</div>
			</div>

			{/* Views Content Grid — supports swipe navigation in addition to the prev/next buttons */}
			<div {...bindSwipe()} className="relative flex flex-1 touch-pan-y flex-col justify-between">
				<AnimatePresence
					mode={pageDirection === 'none' ? 'wait' : 'sync'}
					initial={false}
					custom={pageDirection}
					onExitComplete={() => setPageDirection('none')}
				>
					{view === 'days' && (
						<motion.div
							key={`days-${displayedMonth.getFullYear()}-${displayedMonth.getMonth()}`}
							layout={pageDirection === 'none' ? false : 'position'}
							transition={layoutTransition}
							variants={bodyVariants}
							custom={pageDirection}
							initial="enter"
							animate="center"
							exit="exit"
							className={cn('flex h-full flex-1 flex-col', pageDirection !== 'none' && 'absolute inset-0')}
						>
							{renderDays()}
						</motion.div>
					)}
					{view === 'months' && (
						<motion.div
							key={`months-${displayedMonth.getFullYear()}`}
							variants={bodyVariants}
							custom={pageDirection}
							initial="enter"
							animate="center"
							exit="exit"
							className={cn('flex h-full flex-1 flex-col', pageDirection !== 'none' && 'absolute inset-0')}
						>
							{renderMonths()}
						</motion.div>
					)}
					{view === 'years' && (
						<motion.div
							key={`years-${yearsStart}`}
							variants={bodyVariants}
							custom={pageDirection}
							initial="enter"
							animate="center"
							exit="exit"
							className={cn('flex h-full flex-1 flex-col', pageDirection !== 'none' && 'absolute inset-0')}
						>
							{renderYears()}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

DatePicker.displayName = 'DatePicker';

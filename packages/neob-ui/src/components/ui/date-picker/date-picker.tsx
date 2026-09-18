/* eslint-disable better-tailwindcss/no-unknown-classes */
import { CaretDownIcon, CaretLeftIcon, CaretRightIcon, CaretUpIcon } from '@phosphor-icons/react';
import { useDrag } from '@use-gesture/react';
import { AnimatePresence, motion } from 'motion/react';
import { FocusEvent, KeyboardEvent, MouseEvent, useState } from 'react';
import { DayPicker, type CustomComponents, type DateRange, type Modifiers, type PropsBase } from 'react-day-picker';
import { Temporal } from 'temporal-polyfill';

import { Button, buttonVariants } from '@/components/ui/button';
import { useOptimisticAction } from '@/hooks/use-optimistic-action';
import { fromLegacyDate, toLegacyDate } from '@/lib/temporal-date-compat';
import { cn } from '@/lib/utilities';

import type { Action } from '@/lib/actions';
import type { Transition, Variants } from 'motion/react';

type PageDirection = 'forward' | 'backward' | 'none';
type CalendarView = 'days' | 'months' | 'years';
type DatePickerEvent = MouseEvent | KeyboardEvent;

export interface DatePickerRange {
	readonly from?: Temporal.PlainDate;
	readonly to?: Temporal.PlainDate;
}

export type DatePickerModifiers = Readonly<Modifiers>;

export type DatePickerMatcher =
	| boolean
	| Temporal.PlainDate
	| readonly Temporal.PlainDate[]
	| DatePickerRange
	| { readonly after: Temporal.PlainDate }
	| { readonly before: Temporal.PlainDate }
	| { readonly after: Temporal.PlainDate; readonly before: Temporal.PlainDate }
	| { readonly dayOfWeek: number | number[] }
	| ((date: Temporal.PlainDate) => boolean);

export type DatePickerClassNames = NonNullable<PropsBase['classNames']>;

type SingleValue = Temporal.PlainDate | undefined;
type MultipleValue = readonly Temporal.PlainDate[] | undefined;
type RangeValue = DatePickerRange | undefined;
type DatePickerValue = SingleValue | MultipleValue | RangeValue;
type DatePickerAction<Value extends DatePickerValue> = Action<
	[selected: Value, triggerDate: Temporal.PlainDate, modifiers: DatePickerModifiers, event: DatePickerEvent]
>;
type DatePickerDayEventHandler<Event> = (date: Temporal.PlainDate, modifiers: DatePickerModifiers, event: Event) => void;

type DateBearingBaseProp =
	| 'classNames'
	| 'components'
	| 'dateLib'
	| 'defaultMonth'
	| 'disabled'
	| 'endMonth'
	| 'formatters'
	| 'hidden'
	| 'labels'
	| 'modifiers'
	| 'month'
	| 'onDayBlur'
	| 'onDayClick'
	| 'onDayFocus'
	| 'onDayKeyDown'
	| 'onDayMouseEnter'
	| 'onDayMouseLeave'
	| 'onMonthChange'
	| 'onNextClick'
	| 'onPrevClick'
	| 'startMonth'
	| 'today';

interface BaseProps<Value extends DatePickerValue> extends Omit<PropsBase, DateBearingBaseProp | 'mode' | 'required'> {
	readonly action?: DatePickerAction<Value>;
	readonly classNames?: PropsBase['classNames'];
	readonly components?: PropsBase['components'];
	readonly defaultMonth?: Temporal.PlainDate;
	readonly defaultSelected?: Value;
	readonly disabled?: DatePickerMatcher | readonly DatePickerMatcher[];
	readonly endMonth?: Temporal.PlainDate;
	readonly hidden?: DatePickerMatcher | readonly DatePickerMatcher[];
	readonly modifiers?: Record<string, DatePickerMatcher | readonly DatePickerMatcher[] | undefined>;
	readonly month?: Temporal.PlainDate;
	readonly onDayBlur?: DatePickerDayEventHandler<FocusEvent>;
	readonly onDayClick?: DatePickerDayEventHandler<MouseEvent>;
	readonly onDayFocus?: DatePickerDayEventHandler<FocusEvent>;
	readonly onDayKeyDown?: DatePickerDayEventHandler<KeyboardEvent>;
	readonly onDayMouseEnter?: DatePickerDayEventHandler<MouseEvent>;
	readonly onDayMouseLeave?: DatePickerDayEventHandler<MouseEvent>;
	readonly onMonthChange?: (month: Temporal.PlainDate) => void;
	readonly onNextClick?: (month: Temporal.PlainDate) => void;
	readonly onPrevClick?: (month: Temporal.PlainDate) => void;
	readonly required?: boolean;
	readonly selected?: Value;
	readonly startMonth?: Temporal.PlainDate;
	readonly today?: Temporal.PlainDate;
}

interface SingleProps extends BaseProps<SingleValue> {
	readonly mode: 'single';
}

interface MultipleProps extends BaseProps<MultipleValue> {
	readonly max?: number;
	readonly min?: number;
	readonly mode: 'multiple';
}

interface RangeProps extends BaseProps<RangeValue> {
	readonly max?: number;
	readonly min?: number;
	readonly mode: 'range';
}

export type DatePickerProps = SingleProps | MultipleProps | RangeProps;

const SWIPE_DISTANCE_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 0.5;
const fadeTransition = { duration: 0.05, ease: 'easeOut' } satisfies Transition;
const slideTransition = { type: 'spring', stiffness: 720, damping: 40, mass: 0.55 } satisfies Transition;
const layoutTransition = { type: 'spring', stiffness: 540, damping: 38, mass: 0.7 } satisfies Transition;

const bodyVariants = {
	enter: (direction: PageDirection) => {
		if (direction === 'forward') return { opacity: 0, x: 12, transition: slideTransition };
		if (direction === 'backward') return { opacity: 0, x: -12, transition: slideTransition };
		return { opacity: 0, transition: fadeTransition };
	},
	center: { opacity: 1, x: 0 },
	exit: (direction: PageDirection) => {
		if (direction === 'forward') return { opacity: 0, x: -12, transition: slideTransition };
		if (direction === 'backward') return { opacity: 0, x: 12, transition: slideTransition };
		return { opacity: 0, transition: fadeTransition };
	},
} satisfies Variants;

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
};

const Chevron: CustomComponents['Chevron'] = ({ orientation, ...properties }) => {
	const Icon =
		orientation === 'left' ? CaretLeftIcon : orientation === 'right' ? CaretRightIcon : orientation === 'up' ? CaretUpIcon : CaretDownIcon;
	return <Icon size={14} {...properties} />;
};

function isSameDate(left: Temporal.PlainDate | undefined, right: Temporal.PlainDate | undefined): boolean {
	return Boolean(left && right && Temporal.PlainDate.compare(left, right) === 0);
}

function isPlainDateArray(value: unknown): value is readonly Temporal.PlainDate[] {
	return Array.isArray(value) && value.every((item) => item instanceof Temporal.PlainDate);
}

function isMatcherArray(value: unknown): value is readonly DatePickerMatcher[] {
	return Array.isArray(value);
}

function matchesDate(date: Temporal.PlainDate, matcher: DatePickerMatcher): boolean {
	if (typeof matcher === 'boolean') return matcher;
	if (matcher instanceof Temporal.PlainDate) return isSameDate(date, matcher);
	if (isPlainDateArray(matcher)) return matcher.some((candidate) => isSameDate(date, candidate));
	if (typeof matcher === 'function') return matcher(date);
	if ('dayOfWeek' in matcher) {
		const days = Array.isArray(matcher.dayOfWeek) ? matcher.dayOfWeek : [matcher.dayOfWeek];
		return days.includes(date.dayOfWeek % 7);
	}
	if ('after' in matcher && 'before' in matcher) {
		return Temporal.PlainDate.compare(date, matcher.after) > 0 && Temporal.PlainDate.compare(date, matcher.before) < 0;
	}
	if ('after' in matcher) return Temporal.PlainDate.compare(date, matcher.after) > 0;
	if ('before' in matcher) return Temporal.PlainDate.compare(date, matcher.before) < 0;

	const afterStart = !matcher.from || Temporal.PlainDate.compare(date, matcher.from) >= 0;
	const beforeEnd = !matcher.to || Temporal.PlainDate.compare(date, matcher.to) <= 0;
	return afterStart && beforeEnd;
}

function createLegacyMatcher(matchers: DatePickerMatcher | readonly DatePickerMatcher[] | undefined, timeZone: string) {
	if (matchers === undefined) return;
	const matcherList = isMatcherArray(matchers) ? matchers : [matchers];
	return (legacyDate: Date) => {
		const date = fromLegacyDate(legacyDate, timeZone);
		return matcherList.some((matcher) => matchesDate(date, matcher));
	};
}

function createLegacyModifiers(modifiers: BaseProps<DatePickerValue>['modifiers'], timeZone: string) {
	if (!modifiers) return;
	return Object.fromEntries(Object.entries(modifiers).map(([name, matchers]) => [name, createLegacyMatcher(matchers, timeZone)]));
}

function getInitialMonth(props: DatePickerProps): Temporal.PlainDate {
	if (props.month) return props.month.with({ day: 1 });
	if (props.defaultMonth) return props.defaultMonth.with({ day: 1 });

	const selected = props.selected ?? props.defaultSelected;
	if (selected instanceof Temporal.PlainDate) return selected.with({ day: 1 });
	if (isPlainDateArray(selected) && selected[0]) return selected[0].with({ day: 1 });
	if (selected && 'from' in selected && selected.from) return selected.from.with({ day: 1 });
	return Temporal.Now.plainDateISO().with({ day: 1 });
}

function toModifiers(modifiers: Modifiers): DatePickerModifiers {
	return { ...modifiers };
}

function getFadeMotion() {
	return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
}

/**
 * DatePicker exposes Temporal.PlainDate values while retaining react-day-picker through a narrow compatibility bridge.
 */
export function DatePicker(fullProps: DatePickerProps) {
	const {
		action: _action,
		className,
		classNames,
		components,
		defaultMonth: _defaultMonth,
		defaultSelected: _defaultSelected,
		disabled: _disabled,
		endMonth: _endMonth,
		hidden: _hidden,
		modifiers: _modifiers,
		month: _month,
		onDayBlur: _onDayBlur,
		onDayClick: _onDayClick,
		onDayFocus: _onDayFocus,
		onDayKeyDown: _onDayKeyDown,
		onDayMouseEnter: _onDayMouseEnter,
		onDayMouseLeave: _onDayMouseLeave,
		onMonthChange: _onMonthChange,
		onNextClick: _onNextClick,
		onPrevClick: _onPrevClick,
		selected: _selected,
		startMonth: _startMonth,
		today: _today,
		fixedWeeks = true,
		...dayPickerPassthroughProps
	} = fullProps;
	const [view, setView] = useState<CalendarView>('days');
	const [pageDirection, setPageDirection] = useState<PageDirection>('none');
	const [internalMonth, setInternalMonth] = useState(() => getInitialMonth(fullProps));
	const displayedMonth = (fullProps.month ?? internalMonth).with({ day: 1 });
	const [yearsStart, setYearsStart] = useState(displayedMonth.year - 4);
	const timeZone = fullProps.timeZone ?? Temporal.Now.timeZoneId();
	const toPickerDate = (date: Temporal.PlainDate) => toLegacyDate(date, timeZone);
	const fromPickerDate = (date: Date) => fromLegacyDate(date, timeZone);

	const selectionAction: DatePickerAction<DatePickerValue> = async (selected, triggerDate, modifiers, event) => {
		switch (fullProps.mode) {
			case 'single': {
				if (selected instanceof Temporal.PlainDate || selected === undefined) {
					await fullProps.action?.(selected, triggerDate, modifiers, event);
				}
				return;
			}
			case 'multiple': {
				if (isPlainDateArray(selected) || selected === undefined) {
					await fullProps.action?.(selected, triggerDate, modifiers, event);
				}
				return;
			}
			case 'range': {
				if (!isPlainDateArray(selected) && !(selected instanceof Temporal.PlainDate)) {
					await fullProps.action?.(selected, triggerDate, modifiers, event);
				}
			}
		}
	};
	const { optimisticValue, runAction, isPending } = useOptimisticAction<
		DatePickerValue,
		[Temporal.PlainDate, DatePickerModifiers, DatePickerEvent]
	>({ value: fullProps.selected, defaultValue: fullProps.defaultSelected, action: selectionAction });

	const singleSelection = optimisticValue instanceof Temporal.PlainDate ? optimisticValue : undefined;
	const multipleSelection = isPlainDateArray(optimisticValue) ? optimisticValue : undefined;
	const rangeSelection =
		optimisticValue && !isPlainDateArray(optimisticValue) && !(optimisticValue instanceof Temporal.PlainDate) ? optimisticValue : undefined;

	const handleMonthChange = (newMonth: Temporal.PlainDate) => {
		const normalizedMonth = newMonth.with({ day: 1 });
		setInternalMonth(normalizedMonth);
		fullProps.onMonthChange?.(normalizedMonth);
	};
	const changeView = (nextView: CalendarView) => {
		setPageDirection('none');
		setView(nextView);
	};
	const handlePrevClick = () => {
		if (view === 'days') {
			setPageDirection('backward');
			handleMonthChange(displayedMonth.subtract({ months: 1 }));
			return;
		}
		if (view === 'months') {
			setPageDirection('backward');
			handleMonthChange(displayedMonth.subtract({ years: 1 }));
			return;
		}
		setPageDirection('backward');
		setYearsStart((previous) => previous - 12);
	};
	const handleNextClick = () => {
		if (view === 'days') {
			setPageDirection('forward');
			handleMonthChange(displayedMonth.add({ months: 1 }));
			return;
		}
		if (view === 'months') {
			setPageDirection('forward');
			handleMonthChange(displayedMonth.add({ years: 1 }));
			return;
		}
		setPageDirection('forward');
		setYearsStart((previous) => previous + 12);
	};

	const bindSwipe = useDrag(
		({ last, axis, movement: [movementX], velocity: [velocityX], direction: [directionX] }) => {
			if (!last || axis !== 'x') return;
			const flung = velocityX > SWIPE_VELOCITY_THRESHOLD && Math.abs(movementX) > SWIPE_DISTANCE_THRESHOLD / 2;
			if (movementX < -SWIPE_DISTANCE_THRESHOLD || (flung && directionX < 0)) {
				handleNextClick();
				return;
			}
			if (movementX > SWIPE_DISTANCE_THRESHOLD || (flung && directionX > 0)) handlePrevClick();
		},
		{ axis: 'x', pointer: { touch: true } },
	);

	const dayPickerProps = {
		...dayPickerPassthroughProps,
		showOutsideDays: fullProps.showOutsideDays ?? true,
		fixedWeeks,
		month: toPickerDate(displayedMonth),
		onMonthChange: (month: Date) => handleMonthChange(fromPickerDate(month)),
		onNextClick: fullProps.onNextClick ? (month: Date) => fullProps.onNextClick?.(fromPickerDate(month)) : undefined,
		onPrevClick: fullProps.onPrevClick ? (month: Date) => fullProps.onPrevClick?.(fromPickerDate(month)) : undefined,
		onDayClick: fullProps.onDayClick
			? (date: Date, modifiers: Modifiers, event: MouseEvent) => fullProps.onDayClick?.(fromPickerDate(date), toModifiers(modifiers), event)
			: undefined,
		onDayFocus: fullProps.onDayFocus
			? (date: Date, modifiers: Modifiers, event: FocusEvent) => fullProps.onDayFocus?.(fromPickerDate(date), toModifiers(modifiers), event)
			: undefined,
		onDayBlur: fullProps.onDayBlur
			? (date: Date, modifiers: Modifiers, event: FocusEvent) => fullProps.onDayBlur?.(fromPickerDate(date), toModifiers(modifiers), event)
			: undefined,
		onDayKeyDown: fullProps.onDayKeyDown
			? (date: Date, modifiers: Modifiers, event: KeyboardEvent) =>
					fullProps.onDayKeyDown?.(fromPickerDate(date), toModifiers(modifiers), event)
			: undefined,
		onDayMouseEnter: fullProps.onDayMouseEnter
			? (date: Date, modifiers: Modifiers, event: MouseEvent) =>
					fullProps.onDayMouseEnter?.(fromPickerDate(date), toModifiers(modifiers), event)
			: undefined,
		onDayMouseLeave: fullProps.onDayMouseLeave
			? (date: Date, modifiers: Modifiers, event: MouseEvent) =>
					fullProps.onDayMouseLeave?.(fromPickerDate(date), toModifiers(modifiers), event)
			: undefined,
		hideNavigation: true,
		disableNavigation: true,
		startMonth: fullProps.startMonth ? toPickerDate(fullProps.startMonth) : undefined,
		endMonth: fullProps.endMonth ? toPickerDate(fullProps.endMonth) : undefined,
		today: fullProps.today ? toPickerDate(fullProps.today) : undefined,
		disabled: createLegacyMatcher(fullProps.disabled, timeZone),
		hidden: createLegacyMatcher(fullProps.hidden, timeZone),
		modifiers: createLegacyModifiers(fullProps.modifiers, timeZone),
		classNames: {
			...DAY_PICKER_BASE_CLASSNAMES,
			selected: fullProps.mode === 'range' ? '' : SELECTED_DAY_BUTTON_CLASSES,
			...classNames,
		},
		components: { Chevron, ...components },
	};

	const rangeHasMultipleDays = Boolean(
		fullProps.mode === 'range' &&
		fullProps.selected?.from &&
		fullProps.selected.to &&
		Temporal.PlainDate.compare(fullProps.selected.from, fullProps.selected.to) !== 0,
	);
	const rangeClassNames = {
		range_start: cn(
			'relative z-10',
			SELECTED_DAY_BUTTON_CLASSES,
			rangeHasMultipleDays && '[&_button]:rounded-l-lg [&_button]:rounded-r-sm',
			rangeHasMultipleDays && RANGE_INDICATOR_BASE,
			rangeHasMultipleDays && 'before:right-0 before:left-[calc(50%+16px)]',
			classNames?.range_start,
		),
		range_end: cn(
			'relative z-10',
			SELECTED_DAY_BUTTON_CLASSES,
			rangeHasMultipleDays && '[&_button]:rounded-l-sm [&_button]:rounded-r-lg',
			rangeHasMultipleDays && RANGE_INDICATOR_BASE,
			rangeHasMultipleDays && 'before:right-[calc(50%+16px)] before:left-0',
			classNames?.range_end,
		),
	};

	const renderDays = () => {
		if (fullProps.mode === 'single') {
			return (
				<DayPicker
					{...dayPickerProps}
					mode="single"
					required={fullProps.required}
					selected={singleSelection ? toPickerDate(singleSelection) : undefined}
					onSelect={(selected: Date | undefined, triggerDate: Date, modifiers: Modifiers, event: MouseEvent | KeyboardEvent) => {
						runAction(selected ? fromPickerDate(selected) : undefined, fromPickerDate(triggerDate), toModifiers(modifiers), event);
					}}
				/>
			);
		}

		if (fullProps.mode === 'multiple') {
			return (
				<DayPicker
					{...dayPickerProps}
					mode="multiple"
					required={fullProps.required}
					min={fullProps.min}
					max={fullProps.max}
					selected={multipleSelection?.map((date) => toPickerDate(date))}
					onSelect={(selected: Date[] | undefined, triggerDate: Date, modifiers: Modifiers, event: MouseEvent | KeyboardEvent) => {
						runAction(
							selected?.map((date) => fromPickerDate(date)),
							fromPickerDate(triggerDate),
							toModifiers(modifiers),
							event,
						);
					}}
				/>
			);
		}

		return (
			<DayPicker
				{...dayPickerProps}
				mode="range"
				required={fullProps.required}
				min={fullProps.min}
				max={fullProps.max}
				classNames={{ ...dayPickerProps.classNames, ...rangeClassNames }}
				selected={
					rangeSelection
						? {
								from: rangeSelection.from ? toPickerDate(rangeSelection.from) : undefined,
								to: rangeSelection.to ? toPickerDate(rangeSelection.to) : undefined,
							}
						: undefined
				}
				onSelect={(selected: DateRange | undefined, triggerDate: Date, modifiers: Modifiers, event: MouseEvent | KeyboardEvent) => {
					const range = selected
						? { from: selected.from ? fromPickerDate(selected.from) : undefined, to: selected.to ? fromPickerDate(selected.to) : undefined }
						: undefined;
					runAction(range, fromPickerDate(triggerDate), toModifiers(modifiers), event);
				}}
			/>
		);
	};

	const renderMonths = () => (
		<div className="box-border grid h-69 flex-1 grid-cols-3 items-center gap-2 py-1">
			{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((monthName, index) => (
				<Button
					key={`${monthName}-${index}`}
					type="button"
					variant="subtle"
					color={displayedMonth.month === index + 1 ? 'gold' : undefined}
					action={() => {
						changeView('days');
						handleMonthChange(displayedMonth.with({ month: index + 1, day: 1 }));
					}}
					className="h-12 w-full text-sm"
				>
					{monthName.toUpperCase()}
				</Button>
			))}
		</div>
	);

	const renderYears = () => (
		<div className="box-border grid h-69 flex-1 grid-cols-3 items-center gap-2 py-1">
			{Array.from({ length: 12 }, (_, index) => yearsStart + index).map((year) => (
				<Button
					key={year}
					type="button"
					variant="subtle"
					color={displayedMonth.year === year ? 'gold' : undefined}
					action={() => {
						changeView('days');
						handleMonthChange(displayedMonth.with({ year, day: 1 }));
					}}
					className="h-12 w-full text-sm"
				>
					{year}
				</Button>
			))}
		</div>
	);

	const monthLabel = displayedMonth.toLocaleString(undefined, { month: 'long' });
	const yearLabel = displayedMonth.year.toString();
	const navigationLabel = view === 'days' ? 'month' : view === 'months' ? 'year' : 'years';

	return (
		<div
			className={cn(
				'rdp-root relative box-border flex h-94 w-78 flex-col justify-between rounded-xl border-2 border-edge bg-white p-4 text-black shadow-sm select-none dark:bg-zinc dark:text-white',
				className,
			)}
			aria-busy={isPending || undefined}
			data-pending={isPending ? '' : undefined}
		>
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
								setYearsStart(displayedMonth.year - 4);
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
						action={handlePrevClick}
						aria-label={`Previous ${navigationLabel}`}
						className="size-7 rounded-md"
					>
						<CaretLeftIcon size={14} />
					</Button>
					<Button
						type="button"
						variant="subtle"
						size="icon"
						action={handleNextClick}
						aria-label={`Next ${navigationLabel}`}
						className="size-7 rounded-md"
					>
						<CaretRightIcon size={14} />
					</Button>
				</div>
			</div>

			<div {...bindSwipe()} className="relative flex flex-1 touch-pan-y flex-col justify-between">
				<AnimatePresence
					mode={pageDirection === 'none' ? 'wait' : 'sync'}
					initial={false}
					custom={pageDirection}
					onExitComplete={() => setPageDirection('none')}
				>
					{view === 'days' && (
						<motion.div
							key={`days-${displayedMonth.year}-${displayedMonth.month}`}
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
							key={`months-${displayedMonth.year}`}
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

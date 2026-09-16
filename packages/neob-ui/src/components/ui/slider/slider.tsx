import { Slider as BaseSlider } from '@base-ui/react/slider';
import { CSSProperties, ReactNode } from 'react';

import { useQueuedAction } from '@/hooks/use-queued-action';
import { cn } from '@/lib/utilities';

import type { Action } from '@/lib/actions';
import type { SliderRootProps } from '@base-ui/react/slider';

const MAX_GENERATED_TICKS = 100;

type SliderValue = number | readonly number[];
type SliderInputDetails = Parameters<NonNullable<SliderRootProps<SliderValue>['onValueChange']>>[1];
type SliderCommitDetails = Parameters<NonNullable<SliderRootProps<SliderValue>['onValueCommitted']>>[1];

export interface SliderProperties extends Omit<
	SliderRootProps<SliderValue>,
	'children' | 'onInput' | 'onValueChange' | 'onValueCommitted'
> {
	readonly mode?: 'continuous' | 'ticks';
	readonly label?: ReactNode;
	readonly thumbLabels?: readonly string[];
	readonly tickValues?: readonly number[];
	readonly controlClassName?: string;
	readonly trackClassName?: string;
	readonly indicatorClassName?: string;
	readonly thumbClassName?: string;
	readonly tickClassName?: string;
	readonly 'aria-label'?: string;
	readonly onInput?: (value: SliderValue, eventDetails: SliderInputDetails) => void;
	readonly action?: Action<[value: SliderValue, eventDetails: SliderCommitDetails]>;
}

function createTickValues(min: number, max: number, step: number, tickValues: readonly number[] | undefined) {
	if (tickValues) {
		return [...new Set(tickValues.filter((value) => Number.isFinite(value) && value > min && value < max))];
	}

	if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(step) || step <= 0 || max <= min) return [];

	const intervalCount = Math.floor((max - min) / step);
	if (intervalCount > MAX_GENERATED_TICKS) return [];

	return Array.from({ length: Math.max(intervalCount - 1, 0) }, (_, index) => min + (index + 1) * step).filter((value) => value < max);
}

function getTickStyle(value: number, min: number, max: number, orientation: 'horizontal' | 'vertical'): CSSProperties {
	const position = max === min ? 0 : ((value - min) / (max - min)) * 100;
	return orientation === 'vertical' ? { bottom: `${position}%` } : { left: `${position}%` };
}

function getThumbLabel(
	index: number,
	thumbCount: number,
	label: ReactNode,
	ariaLabel: string | undefined,
	thumbLabels: readonly string[] | undefined,
) {
	const explicitLabel = thumbLabels?.[index];
	if (explicitLabel) return explicitLabel;

	const sliderLabel = ariaLabel ?? (typeof label === 'string' ? label : 'Slider');
	if (thumbCount === 1) return sliderLabel;
	if (index === 0) return `Minimum ${sliderLabel}`;
	if (index === thumbCount - 1) return `Maximum ${sliderLabel}`;
	return `${sliderLabel} value ${index + 1}`;
}

export function Slider({
	mode = 'continuous',
	label,
	thumbLabels,
	tickValues,
	min = 0,
	max = 100,
	step = 1,
	orientation = 'horizontal',
	disabled = false,
	value,
	defaultValue,
	className,
	controlClassName,
	trackClassName,
	indicatorClassName,
	thumbClassName,
	tickClassName,
	'aria-label': ariaLabel,
	ref,
	onInput,
	action,
	...properties
}: SliderProperties) {
	const { runAction, isPending } = useQueuedAction(action);
	const currentValue = value ?? defaultValue;
	const thumbCount = typeof currentValue === 'number' || currentValue === undefined ? 1 : Math.max(currentValue.length, 1);
	const ticks = mode === 'ticks' ? createTickValues(min, max, step, tickValues) : [];

	return (
		<BaseSlider.Root
			ref={ref}
			value={value}
			defaultValue={defaultValue}
			min={min}
			max={max}
			step={step}
			orientation={orientation}
			disabled={disabled}
			className={cn('flex w-full flex-col gap-2 data-[orientation=vertical]:w-fit', className)}
			onValueChange={onInput}
			onValueCommitted={(nextValue, eventDetails) => {
				void runAction(nextValue, eventDetails).catch(() => {});
			}}
			aria-busy={isPending || undefined}
			data-pending={isPending ? '' : undefined}
			{...properties}
		>
			{label && (
				<BaseSlider.Label className={cn('text-sm/normal font-bold text-foreground', disabled && 'text-muted-foreground')}>
					{label}
				</BaseSlider.Label>
			)}
			<BaseSlider.Control
				className={cn(
					'flex h-11 w-full touch-none items-center select-none data-[orientation=vertical]:h-64 data-[orientation=vertical]:w-11 data-[orientation=vertical]:justify-center',
					disabled && 'cursor-not-allowed',
					controlClassName,
				)}
			>
				<BaseSlider.Track
					className={cn(
						'relative h-4 w-full rounded-full bg-white select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:w-4 dark:bg-zinc',
						disabled && 'bg-muted/70 dark:bg-muted',
						trackClassName,
					)}
				>
					<BaseSlider.Indicator
						className={cn('z-0 rounded-[inherit] bg-cyan select-none', disabled && 'bg-muted-foreground/30', indicatorClassName)}
					/>
					<span
						aria-hidden="true"
						className={cn(
							'pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-edge shadow-cel-inset-sm',
							disabled && 'border-muted-foreground/50 shadow-none',
						)}
					/>
					{ticks.map((tick) => (
						<span
							key={tick}
							aria-hidden="true"
							style={getTickStyle(tick, min, max, orientation)}
							className={cn(
								'pointer-events-none absolute size-1 rounded-full bg-edge/60',
								orientation === 'vertical' ? 'left-1/2 -translate-x-1/2 translate-y-1/2' : 'top-1/2 -translate-1/2',
								disabled && 'bg-muted-foreground/35',
								tickClassName,
							)}
						/>
					))}
					{Array.from({ length: thumbCount }, (_, index) => (
						<BaseSlider.Thumb
							key={index}
							index={index}
							getAriaLabel={() => getThumbLabel(index, thumbCount, label, ariaLabel, thumbLabels)}
							className={cn(
								'neo-focus-ring-focus isolate flex size-6 cursor-pointer rounded-md border border-edge bg-white shadow-cel-xs outline-hidden transition-[background-color,border-color,box-shadow] duration-75 select-none data-disabled:cursor-not-allowed data-dragging:shadow-cel-sm dark:bg-zinc',
								disabled && 'border-muted-foreground/50 bg-muted shadow-none dark:bg-muted',
								thumbClassName,
							)}
						/>
					))}
				</BaseSlider.Track>
			</BaseSlider.Control>
		</BaseSlider.Root>
	);
}

Slider.displayName = 'Slider';

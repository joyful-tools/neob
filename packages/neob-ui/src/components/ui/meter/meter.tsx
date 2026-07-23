import { Meter as BaseMeter } from '@base-ui/react/meter';

import { cn } from '@/lib/utilities';

interface MeterProperties {
	readonly value?: number | undefined;
	readonly max?: number;
	readonly className?: string;
	readonly trackClassName?: string;
	readonly indicatorClassName?: string;
	readonly 'aria-label'?: string;
	readonly 'aria-labelledby'?: string;
}

export function Meter({
	value,
	max = 100,
	className,
	trackClassName,
	indicatorClassName,
	'aria-label': ariaLabel = 'Meter',
	'aria-labelledby': ariaLabelledby,
}: MeterProperties) {
	return (
		<BaseMeter.Root
			value={value ?? 0}
			max={max}
			className={cn('flex w-full items-center', className)}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledby}
		>
			<BaseMeter.Track
				className={cn(
					`h-4 w-full overflow-hidden rounded-full border-2 border-edge bg-white shadow-cel-inset-sm dark:bg-zinc`,
					trackClassName,
				)}
			>
				<BaseMeter.Indicator className={cn('h-full bg-orange transition-all duration-300 ease-out', indicatorClassName)} />
			</BaseMeter.Track>
		</BaseMeter.Root>
	);
}
Meter.displayName = 'Meter';

export type { MeterProperties };

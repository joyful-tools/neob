import { Meter as BaseMeter } from '@base-ui/react/meter';
import * as React from 'react';

import { cn } from '@/lib/utilities';

interface MeterProperties {
	value?: number | undefined;
	max?: number;
	className?: string;
	trackClassName?: string;
	indicatorClassName?: string;
	'aria-label'?: string;
	'aria-labelledby'?: string;
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
					`h-4 w-full overflow-hidden rounded-full border-2 border-black bg-white shadow-brutal-inset-sm dark:bg-zinc`,
					trackClassName,
				)}
			>
				<BaseMeter.Indicator className={cn('h-full bg-orange transition-all duration-300 ease-out', indicatorClassName)} />
			</BaseMeter.Track>
		</BaseMeter.Root>
	);
}

export type { MeterProperties };

import { Progress as BaseProgress } from '@base-ui/react/progress';
import * as React from 'react';

import { cn } from '@/lib/utilities';

interface ProgressProperties {
	value?: number | undefined;
	max?: number;
	className?: string;
	trackClassName?: string;
	indicatorClassName?: string;
}

export function Progress({ value, max = 100, className, trackClassName, indicatorClassName }: ProgressProperties) {
	return (
		<BaseProgress.Root value={value ?? 0} max={max} className={cn('flex w-full items-center', className)}>
			<BaseProgress.Track
				className={cn(
					`
						h-4 w-full overflow-hidden rounded-full border-2 border-black
						bg-white shadow-brutal-inset-sm
					`,
					trackClassName,
				)}
			>
				<BaseProgress.Indicator className={cn('h-full bg-orange transition-all duration-300 ease-out', indicatorClassName)} />
			</BaseProgress.Track>
		</BaseProgress.Root>
	);
}
export type { ProgressProperties };

import { motion } from 'motion/react';

import { cn } from '@/lib/utilities';

const BAR_COUNT = 5;

interface LoadingBarsProperties {
	readonly className?: string;
	readonly colorClassName?: string;
}

export function LoadingBars({ className, colorClassName = 'bg-orange' }: LoadingBarsProperties) {
	return (
		<div className={cn('flex h-8 items-end gap-1', className)} role="status" aria-label="Loading">
			{Array.from({ length: BAR_COUNT }, (_, index) => (
				<motion.div
					key={index}
					className={cn('w-1.5 rounded-xs border-2 border-black dark:border-white', colorClassName)}
					animate={{
						height: [12 + index * 4, 24 + index * 2, 12 + index * 4],
						opacity: [0.5, 1, 0.5],
					}}
					transition={{ duration: 1, repeat: Infinity, delay: index * 0.12, ease: 'easeInOut' }}
					style={{ height: 12 + index * 4 }}
				/>
			))}
			<span className="sr-only">Loading...</span>
		</div>
	);
}

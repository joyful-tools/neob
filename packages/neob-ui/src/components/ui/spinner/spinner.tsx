import { CircleNotchIcon } from '@phosphor-icons/react';
import { motion, useTime, useTransform } from 'motion/react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utilities';

interface SpinnerProperties {
	readonly className?: string;
	readonly size?: 'sm' | 'md' | 'lg';
	readonly label?: string;
}

const SIZE_CLASSES = {
	sm: 'size-4',
	md: 'size-12',
	lg: 'size-16',
} as const;

/**
 * A synchronized spinner that maintains consistent rotation across all instances.
 * Uses framer motion's useTime hook which provides a synchronized time value,
 * so all spinners appear in sync regardless of when they mount.
 */
export function Spinner({ className, size = 'md', label }: SpinnerProperties) {
	// useTime returns a MotionValue that updates with the current time in ms
	// This is synchronized across all components using it
	const time = useTime();
	const prefersReducedMotion = usePrefersReducedMotion();

	// Transform time to rotation: 1 full rotation (360°) per 1000ms
	const rotate = useTransform(time, (t) => (prefersReducedMotion ? 0 : (t / 1000) * 360));

	return (
		<motion.div
			role={label ? 'status' : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			initial={{ opacity: 1, scale: 1 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0 }}
			style={{ rotate }}
			className={cn(SIZE_CLASSES[size], className)}
		>
			<CircleNotchIcon className="size-full" />
		</motion.div>
	);
}
Spinner.displayName = 'Spinner';

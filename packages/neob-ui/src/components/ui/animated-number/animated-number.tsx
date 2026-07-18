import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

interface AnimatedNumberProperties {
	readonly value: number;
	readonly className?: string;
	readonly duration?: number;
	readonly instant?: boolean;
}

/**
 * Animated number component that tweens between values using motion
 */
export function AnimatedNumber({ value, className, duration = 0.6, instant = false }: AnimatedNumberProperties) {
	const motionValue = useMotionValue(value);
	const prefersReducedMotion = usePrefersReducedMotion();
	const display = useTransform(motionValue, (current: number) => Math.round(current));

	useEffect(() => {
		if (instant || prefersReducedMotion) {
			motionValue.set(value);
			return;
		}
		const controls = animate(motionValue, value, {
			duration,
			ease: 'easeOut',
		});
		return () => controls.stop();
	}, [motionValue, value, duration, instant, prefersReducedMotion]);

	return <motion.span className={className}>{display}</motion.span>;
}
AnimatedNumber.displayName = 'AnimatedNumber';

import NumberFlow, {
	continuous as continuousPlugin,
	type Format,
	type NumberFlowElement,
	type Trend,
	type Value,
} from '@number-flow/react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { type CSSProperties, useEffect } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utilities';

export interface CustomCSSProperties extends CSSProperties {
	[key: `--${string}`]: string | number;
}

export interface RollingDigitProps {
	readonly value: Value;
	readonly className?: string;
	readonly locales?: Intl.LocalesArgument;
	readonly format?: Format;
	readonly prefix?: string;
	readonly suffix?: string;
	readonly trend?: Trend;
	readonly continuous?: boolean;
	readonly animated?: boolean;
	readonly isolate?: boolean;
	readonly willChange?: boolean;
	readonly transformTiming?: KeyframeAnimationOptions;
	readonly spinTiming?: KeyframeAnimationOptions;
	readonly opacityTiming?: KeyframeAnimationOptions;
	readonly style?: CustomCSSProperties;
	readonly ref?: React.Ref<NumberFlowElement>;
}

/**
 * Neo-Brutalist rolling digit display powered by Number Flow.
 * Features layout-aware digit transitions, continuous reel rotation, and synchronized subtle container width animations.
 */
export function RollingDigit({
	value,
	className,
	locales,
	format,
	prefix,
	suffix,
	trend,
	continuous = false,
	animated = true,
	isolate = true,
	willChange = true,
	transformTiming = { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
	spinTiming = { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
	opacityTiming = { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
	style,
	ref,
}: RollingDigitProps) {
	const plugins = continuous ? [continuousPlugin] : undefined;
	const customStyle: CustomCSSProperties = {
		'--number-flow-mask-width': '0.4em',
		'--number-flow-mask-height': '0.2em',
		...style,
	};

	return (
		<NumberFlow
			ref={ref}
			value={value}
			locales={locales}
			format={format}
			prefix={prefix}
			suffix={suffix}
			trend={trend}
			plugins={plugins}
			animated={animated}
			isolate={isolate}
			willChange={willChange}
			transformTiming={transformTiming}
			spinTiming={spinTiming}
			opacityTiming={opacityTiming}
			style={customStyle}
			className={cn(
				'inline-flex max-w-full items-center overflow-hidden font-mono font-bold tracking-tight text-foreground tabular-nums transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
				className,
			)}
		/>
	);
}
RollingDigit.displayName = 'RollingDigit';

export interface AnimatedNumberProperties {
	readonly value: number;
	readonly className?: string;
	readonly duration?: number;
	readonly instant?: boolean;
	readonly mode?: 'tween' | 'rolling';
	readonly format?: Format;
	readonly locales?: Intl.LocalesArgument;
	readonly prefix?: string;
	readonly suffix?: string;
	readonly trend?: Trend;
	readonly continuous?: boolean;
	readonly style?: CustomCSSProperties;
	readonly ref?: React.Ref<NumberFlowElement>;
}

/**
 * Animated number component supporting both smooth tweening and rolling digit transition modes.
 */
export function AnimatedNumber({
	value,
	className,
	duration = 0.6,
	instant = false,
	mode = 'rolling',
	format,
	locales,
	prefix,
	suffix,
	trend,
	continuous,
	style,
	ref,
}: AnimatedNumberProperties) {
	const motionValue = useMotionValue(value);
	const prefersReducedMotion = usePrefersReducedMotion();
	const display = useTransform(motionValue, (current: number) => Math.round(current));

	useEffect(() => {
		if (mode !== 'tween') return;
		if (instant || prefersReducedMotion) {
			motionValue.set(value);
			return;
		}
		const controls = animate(motionValue, value, {
			duration,
			ease: 'easeOut',
		});
		return () => controls.stop();
	}, [motionValue, value, duration, instant, prefersReducedMotion, mode]);

	if (mode === 'rolling') {
		return (
			<RollingDigit
				ref={ref}
				value={value}
				className={className}
				locales={locales}
				format={format}
				prefix={prefix}
				suffix={suffix}
				trend={trend}
				continuous={continuous}
				animated={!instant && !prefersReducedMotion}
				style={style}
			/>
		);
	}

	return (
		<motion.span ref={ref} className={cn('font-mono font-bold', className)} style={style}>
			{display}
		</motion.span>
	);
}
AnimatedNumber.displayName = 'AnimatedNumber';

export { NumberFlowGroup, type Format, type Trend, type Value } from '@number-flow/react';

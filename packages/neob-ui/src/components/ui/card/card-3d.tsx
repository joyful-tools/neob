import { motion, useTransform, type HTMLMotionProps, type MotionStyle, type MotionValue } from 'motion/react';
import { type ReactNode } from 'react';

import { cn } from '@/lib/utilities';

import { Hover3d } from './hover-3d';

import type { Hover3dState } from '@/hooks/use-hover-3d';

import './card-3d.css';

interface Card3dMotionStyle extends MotionStyle {
	'--card-hover': MotionValue<number>;
	'--card-pointer-x': MotionValue<string>;
	'--card-pointer-y': MotionValue<string>;
	'--card-shine-pointer-x': MotionValue<string>;
	'--card-shine-pointer-y': MotionValue<string>;
	'--card-shine-pos-x': MotionValue<string>;
	'--card-shine-pos-y': MotionValue<string>;
}

export interface Card3dProperties extends Omit<HTMLMotionProps<'div'>, 'children'> {
	active?: boolean;
	children: ReactNode | ((state: Hover3dState) => ReactNode);
	containerClassName?: string;
	enableDeviceMotion?: boolean;
	enableTouch?: boolean;
	maxTilt?: number;
	overlay?: ReactNode;
	shiny?: boolean;
}

interface Card3dSurfaceProperties extends Omit<
	Card3dProperties,
	'active' | 'containerClassName' | 'enableDeviceMotion' | 'enableTouch' | 'maxTilt'
> {
	state: Hover3dState;
}

function Card3dSurface({ children, className, overlay, shiny = false, state, style, ...properties }: Card3dSurfaceProperties) {
	const scale = useTransform(state.hover, (value) => 1 + value * 0.05);
	const filter = useTransform(state.hover, (value) => `drop-shadow(0 25px 25px rgb(0 0 0 / ${0.15 + value * 0.1}))`);
	const pointerX = useTransform(state.x, (value) => `${(value + 1) * 50}%`);
	const pointerY = useTransform(state.y, (value) => `${(value + 1) * 50}%`);
	const shinePointerX = useTransform(state.x, (value) => `${50 + value * 30}%`);
	const shinePointerY = useTransform(state.y, (value) => `${50 + value * 30}%`);
	const shinePositionX = useTransform(state.x, (value) => `${50 + value * state.maxTilt * 0.6}%`);
	const shinePositionY = useTransform(state.y, (value) => `${50 + value * state.maxTilt * 0.6}%`);
	const cardStyle: Card3dMotionStyle = {
		...style,
		'--card-hover': state.hover,
		'--card-pointer-x': pointerX,
		'--card-pointer-y': pointerY,
		'--card-shine-pointer-x': shinePointerX,
		'--card-shine-pointer-y': shinePointerY,
		'--card-shine-pos-x': shinePositionX,
		'--card-shine-pos-y': shinePositionY,
	};

	return (
		<motion.div className="relative h-full select-none" style={{ scale }}>
			<motion.div className="h-full" style={{ filter }}>
				<motion.div className={cn('relative h-full', className)} style={cardStyle} {...properties}>
					<div data-neob-card3d-clip className="relative h-full overflow-hidden rounded-[inherit]">
						{typeof children === 'function' ? children(state) : children}
						{shiny && <div data-neob-card3d-shine aria-hidden="true" />}
						{!shiny && <div data-neob-card3d-flare aria-hidden="true" />}
					</div>
					{overlay && <div className="pointer-events-none absolute inset-0 transform-3d">{overlay}</div>}
				</motion.div>
			</motion.div>
		</motion.div>
	);
}

export function Card3d({ active, containerClassName, enableDeviceMotion, enableTouch, maxTilt, ...properties }: Card3dProperties) {
	return (
		<Hover3d
			active={active}
			className={containerClassName}
			enableDeviceMotion={enableDeviceMotion}
			enableTouch={enableTouch}
			maxTilt={maxTilt}
		>
			{(state) => <Card3dSurface state={state} {...properties} />}
		</Hover3d>
	);
}

Card3d.displayName = 'Card3d';

import { motion, useTransform, type HTMLMotionProps, type MotionStyle } from 'motion/react';
import { type ReactNode, type Ref } from 'react';

import { useHover3d, type Hover3dState, type UseHover3dOptions } from '@/hooks/use-hover-3d';
import { cn } from '@/lib/utilities';

export interface Hover3dProperties
	extends UseHover3dOptions, Omit<HTMLMotionProps<'div'>, 'children' | 'onPointerLeave' | 'onPointerMove' | 'ref'> {
	children: ReactNode | ((state: Hover3dState) => ReactNode);
	ref?: Ref<HTMLDivElement>;
}

function setRefValue(ref: Ref<HTMLDivElement> | undefined, value: HTMLDivElement | null): void {
	if (typeof ref === 'function') {
		ref(value);
		return;
	}
	if (ref) ref.current = value;
}

export function Hover3d({
	active,
	children,
	className,
	enableDeviceMotion,
	enableTouch,
	maxTilt,
	ref,
	style,
	...properties
}: Hover3dProperties) {
	const state = useHover3d({ active, enableDeviceMotion, enableTouch, maxTilt });
	const rotateX = useTransform(state.y, (value) => value * state.maxTilt);
	const rotateY = useTransform(state.x, (value) => value * -state.maxTilt);
	const motionStyle: MotionStyle = { ...style, rotateX, rotateY, transformPerspective: 1000 };
	const setRootRef = (node: HTMLDivElement | null) => {
		state.rootRef(node);
		setRefValue(ref, node);
	};

	return (
		<motion.div
			ref={setRootRef}
			className={cn('h-full touch-pan-y will-change-transform transform-3d', enableTouch && 'touch-none', className)}
			style={motionStyle}
			onPointerMove={state.handlePointerMove}
			onPointerLeave={state.handlePointerLeave}
			{...properties}
		>
			{typeof children === 'function' ? children(state) : children}
		</motion.div>
	);
}

Hover3d.displayName = 'Hover3d';

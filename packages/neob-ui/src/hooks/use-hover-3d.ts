import { useMotionValue, useSpring, type MotionValue } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

interface Bounds {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface UseHover3dOptions {
	active?: boolean;
	enableDeviceMotion?: boolean;
	enableTouch?: boolean;
	maxTilt?: number;
}

export interface Hover3dState {
	hover: MotionValue<number>;
	hovering: boolean;
	maxTilt: number;
	x: MotionValue<number>;
	y: MotionValue<number>;
}

const tiltSpring = { stiffness: 9, damping: 1.7, mass: 1, restDelta: 0.001 };
const hoverSpring = { stiffness: 52, damping: 4, mass: 1, restDelta: 0.001 };

function clamp(value: number): number {
	return Math.max(-1, Math.min(1, value));
}

export function useHover3d({ active = false, enableDeviceMotion = false, enableTouch = false, maxTilt = 10 }: UseHover3dOptions = {}) {
	const rootRef = useRef<HTMLDivElement>(null);
	const boundsRef = useRef<Bounds>({ left: 0, top: 0, width: 0, height: 0 });
	const pointerRef = useRef({ x: 0, y: 0 });
	const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const hoveringRef = useRef(false);
	const [hovering, setHovering] = useState(false);
	const prefersReducedMotion = usePrefersReducedMotion();
	const targetX = useMotionValue(0);
	const targetY = useMotionValue(0);
	const hoverTarget = useMotionValue(active ? 1 : 0);
	const x = useSpring(targetX, tiltSpring);
	const y = useSpring(targetY, tiltSpring);
	const hover = useSpring(hoverTarget, hoverSpring);
	const setRootRef = useCallback((node: HTMLDivElement | null) => {
		rootRef.current = node;
	}, []);

	const setHoveringState = useCallback((next: boolean) => {
		hoveringRef.current = next;
		setHovering(next);
	}, []);

	const reset = useCallback(
		(immediate = false) => {
			setHoveringState(false);
			pointerRef.current = { x: 0, y: 0 };
			if (immediate || prefersReducedMotion) {
				targetX.jump(0);
				targetY.jump(0);
				x.jump(0);
				y.jump(0);
				hover.jump(active ? 1 : 0);
				hoverTarget.jump(active ? 1 : 0);
				return;
			}
			targetX.set(0);
			targetY.set(0);
			hoverTarget.set(active ? 1 : 0);
		},
		[active, hover, hoverTarget, prefersReducedMotion, setHoveringState, targetX, targetY, x, y],
	);

	const updateBounds = useCallback(() => {
		const root = rootRef.current;
		if (!root) return;
		const bounds = root.getBoundingClientRect();
		boundsRef.current = bounds;
		const pointer = pointerRef.current;
		if (
			pointer.x > bounds.left + bounds.width ||
			pointer.x < bounds.left ||
			pointer.y > bounds.top + bounds.height ||
			pointer.y < bounds.top
		) {
			reset();
		}
	}, [reset]);

	useEffect(() => {
		hoverTarget.set(active || hovering ? 1 : 0);
	}, [active, hoverTarget, hovering]);

	useEffect(() => {
		// A changed OS preference must also clear interaction state and active motion values.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (prefersReducedMotion) reset(true);
	}, [prefersReducedMotion, reset]);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		let frame = 0;
		const scheduleBoundsUpdate = () => {
			if (frame !== 0) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				updateBounds();
			});
		};
		const observer = new ResizeObserver(scheduleBoundsUpdate);
		observer.observe(root);
		updateBounds();
		globalThis.addEventListener('resize', scheduleBoundsUpdate);
		globalThis.addEventListener('scroll', scheduleBoundsUpdate, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			globalThis.removeEventListener('resize', scheduleBoundsUpdate);
			globalThis.removeEventListener('scroll', scheduleBoundsUpdate);
		};
	}, [updateBounds]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'hidden') reset(true);
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, [reset]);

	useEffect(() => {
		if (!enableDeviceMotion || prefersReducedMotion) return;
		const handleDeviceMotion = (event: DeviceMotionEvent) => {
			if (hoveringRef.current || !event.rotationRate) return;
			const { alpha, beta } = event.rotationRate;
			if (beta !== null) targetX.set(clamp(beta * 0.01));
			if (alpha !== null) targetY.set(clamp(alpha * 0.01));
		};
		globalThis.addEventListener('devicemotion', handleDeviceMotion);
		return () => globalThis.removeEventListener('devicemotion', handleDeviceMotion);
	}, [enableDeviceMotion, prefersReducedMotion, targetX, targetY]);

	useEffect(() => {
		const handlePointerDown = (event: PointerEvent) => {
			const root = rootRef.current;
			if (root && event.target instanceof Node && !root.contains(event.target)) reset();
		};
		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	}, [reset]);

	useEffect(() => {
		return () => {
			if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
		};
	}, []);

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (prefersReducedMotion || (event.pointerType === 'touch' && !enableTouch)) return;
		if (event.pointerType === 'touch') {
			if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
			touchTimeoutRef.current = setTimeout(reset, 3000);
		}
		const bounds = boundsRef.current;
		if (bounds.width === 0 || bounds.height === 0) return;
		pointerRef.current = { x: event.clientX, y: event.clientY };
		setHoveringState(true);
		targetX.set(clamp((event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)));
		targetY.set(clamp((event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2)));
	};

	const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
		if (event.pointerType !== 'touch') reset();
	};

	return { handlePointerLeave, handlePointerMove, hover, hovering, maxTilt, reset, rootRef: setRootRef, x, y };
}

import { type HTMLAttributes, type Ref, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

export interface StackHeaderProps extends HTMLAttributes<HTMLElement> {
	readonly threshold?: number;
	readonly ref?: Ref<HTMLElement>;
}

/** A sticky header that yields space while scrolling down and returns on intent. */
export function StackHeader({ threshold = 8, className, onFocusCapture, ref, ...props }: StackHeaderProps) {
	const elementRef = useRef<HTMLElement | null>(null);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		let headerHeight = element.offsetHeight;
		let previousScrollY = window.scrollY;
		let accumulatedDelta = 0;
		let frameId: number | undefined;

		const resizeObserver = new ResizeObserver(() => {
			headerHeight = element.offsetHeight;
		});

		const update = () => {
			frameId = undefined;
			const scrollY = Math.max(window.scrollY, 0);
			const delta = scrollY - previousScrollY;
			const directionChanged = Math.sign(delta) !== Math.sign(accumulatedDelta);
			accumulatedDelta = directionChanged ? delta : accumulatedDelta + delta;
			previousScrollY = scrollY;

			const hasExpandedControl = element.querySelector('[aria-expanded="true"]') !== null;
			const hasFocus = element.contains(document.activeElement);
			if (scrollY <= headerHeight || hasExpandedControl || hasFocus) {
				accumulatedDelta = 0;
				setHidden(false);
				return;
			}

			if (Math.abs(accumulatedDelta) >= threshold) {
				setHidden(accumulatedDelta > 0);
				accumulatedDelta = 0;
			}
		};

		const handleScroll = () => {
			if (frameId === undefined) frameId = globalThis.requestAnimationFrame(update);
		};

		resizeObserver.observe(element);
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			resizeObserver.disconnect();
			window.removeEventListener('scroll', handleScroll);
			if (frameId !== undefined) globalThis.cancelAnimationFrame(frameId);
		};
	}, [threshold]);

	return (
		<header
			ref={(node) => {
				elementRef.current = node;
				if (typeof ref === 'function') ref(node);
				else if (ref) ref.current = node;
			}}
			data-hidden={hidden ? '' : undefined}
			className={cn(
				'sticky top-0 z-40 transition-transform duration-(--duration-control) ease-spring data-hidden:-translate-y-full motion-reduce:transition-none',
				className,
			)}
			onFocusCapture={(event) => {
				setHidden(false);
				onFocusCapture?.(event);
			}}
			{...props}
		/>
	);
}

StackHeader.displayName = 'StackHeader';

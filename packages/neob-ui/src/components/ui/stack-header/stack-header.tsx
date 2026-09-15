import { type HTMLAttributes, type Ref, useEffect, useRef } from 'react';

import { cn } from '@/lib/utilities';

export interface StackHeaderProps extends HTMLAttributes<HTMLElement> {
	/** Distance in pixels required before accepting a scroll-direction reversal. */
	readonly threshold?: number;
	readonly ref?: Ref<HTMLElement>;
}

/** A sticky header that follows scrolling out of and back into the viewport. */
export function StackHeader({ threshold = 0, className, onFocusCapture, ref, style, ...props }: StackHeaderProps) {
	const elementRef = useRef<HTMLElement | null>(null);
	const revealRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		let headerHeight = element.offsetHeight;
		let previousScrollY = Math.max(window.scrollY, 0);
		let headerOffset = -Math.min(previousScrollY, headerHeight);
		let direction: 'up' | 'down' = 'down';
		let pendingDirection: 'up' | 'down' | undefined;
		let pendingDistance = 0;
		let frameId: number | undefined;

		const renderOffset = () => {
			element.style.setProperty('--stack-header-offset', `${headerOffset}px`);
			element.toggleAttribute('data-hidden', headerHeight > 0 && headerOffset <= -headerHeight);
		};

		const reveal = () => {
			headerOffset = 0;
			pendingDirection = undefined;
			pendingDistance = 0;
			renderOffset();
		};
		revealRef.current = reveal;

		const update = () => {
			frameId = undefined;
			const scrollY = Math.max(window.scrollY, 0);
			const delta = scrollY - previousScrollY;
			previousScrollY = scrollY;

			const hasExpandedControl = element.querySelector('[aria-expanded="true"]') !== null;
			const hasFocus = element.contains(document.activeElement);
			if (scrollY <= 0 || hasExpandedControl || hasFocus) {
				reveal();
				return;
			}
			if (delta === 0) return;

			const nextDirection = delta > 0 ? 'down' : 'up';
			let appliedDelta = delta;
			if (nextDirection !== direction && threshold > 0) {
				if (pendingDirection !== nextDirection) {
					pendingDirection = nextDirection;
					pendingDistance = 0;
				}
				pendingDistance += Math.abs(delta);
				if (pendingDistance < threshold) return;
				appliedDelta = nextDirection === 'down' ? pendingDistance : -pendingDistance;
			}

			direction = nextDirection;
			pendingDirection = undefined;
			pendingDistance = 0;
			headerOffset = Math.max(-headerHeight, Math.min(0, headerOffset - appliedDelta));
			renderOffset();
		};

		const handleScroll = () => {
			if (frameId === undefined) frameId = globalThis.requestAnimationFrame(update);
		};

		const resizeObserver = new ResizeObserver(() => {
			const wasHidden = headerHeight > 0 && headerOffset <= -headerHeight;
			headerHeight = element.offsetHeight;
			headerOffset = previousScrollY <= 0 ? 0 : wasHidden ? -headerHeight : Math.max(-headerHeight, headerOffset);
			renderOffset();
		});

		renderOffset();
		resizeObserver.observe(element);
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			revealRef.current = null;
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
			className={cn('sticky top-0 z-40 translate-y-(--stack-header-offset)', className)}
			style={style}
			onFocusCapture={(event) => {
				revealRef.current?.();
				onFocusCapture?.(event);
			}}
			{...props}
		/>
	);
}

StackHeader.displayName = 'StackHeader';

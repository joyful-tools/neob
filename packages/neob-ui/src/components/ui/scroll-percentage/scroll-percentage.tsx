import { RefObject, useEffect, useState } from 'react';

interface ScrollPercentageProperties {
	readonly axis?: 'x' | 'y';
	readonly containerRef?: RefObject<HTMLElement | null>;
	readonly children?: (percentage: number) => React.ReactNode;
}

/**
 * Hook to track scroll percentage of an element or the window.
 * Matches the reactivity of the original Svelte implementation with a 50ms throttle.
 */
export function useScrollPercentage(axis: 'x' | 'y' = 'y', containerRef?: RefObject<HTMLElement | null>) {
	const [percentage, setPercentage] = useState<number>(0);

	useEffect(() => {
		// Use documentElement as default scrolling element if containerRef is not passed
		const element = containerRef ? containerRef.current : document.documentElement;
		if (!element) return;

		const calcScrollPercentage = () => {
			const scrollLength = axis === 'x' ? element.scrollWidth : element.scrollHeight;
			const scrollSize = axis === 'x' ? element.clientWidth : element.clientHeight;
			const availableScroll = scrollLength - scrollSize;

			if (availableScroll <= 0) {
				setPercentage(0);
				return;
			}

			const scrollPos = axis === 'x' ? element.scrollLeft : element.scrollTop;
			const scrollPercentage = (scrollPos / availableScroll) * 100;
			// Round to 3 decimal places matching original logic
			setPercentage(Math.round(scrollPercentage * 1000) / 1000);
		};

		// Initial calculation
		calcScrollPercentage();

		let animationFrameId: number | undefined;

		const handleScroll = () => {
			if (animationFrameId !== undefined) return;
			animationFrameId = requestAnimationFrame(() => {
				animationFrameId = undefined;
				calcScrollPercentage();
			});
		};

		// If element is document.documentElement, we attach the scroll listener to window
		const target = element === document.documentElement ? globalThis : element;
		target.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', calcScrollPercentage, { passive: true });

		return () => {
			target.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', calcScrollPercentage);
			if (animationFrameId !== undefined) cancelAnimationFrame(animationFrameId);
		};
	}, [axis, containerRef]);

	return percentage;
}

/**
 * ScrollPercentage component that passes the scroll percentage to its children render function.
 */
export function ScrollPercentage({ axis = 'y', containerRef, children }: ScrollPercentageProperties) {
	const percentage = useScrollPercentage(axis, containerRef);

	if (!children) {
		return <span className="font-mono">{percentage}%</span>;
	}

	return <>{children(percentage)}</>;
}
ScrollPercentage.displayName = 'ScrollPercentage';

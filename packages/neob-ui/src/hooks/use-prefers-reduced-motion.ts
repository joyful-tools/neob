import { useEffect, useState } from 'react';

/**
 * A React hook that detects the user's system preference for reduced motion.
 * Used to disable or adjust animations for accessibility.
 *
 * @returns A boolean indicating whether reduced motion is preferred.
 */
export function usePrefersReducedMotion(): boolean {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
		if (globalThis.window !== undefined) {
			return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
		return false;
	});

	useEffect(() => {
		if (globalThis.window === undefined) {
			return;
		}

		const mediaQuery = globalThis.matchMedia('(prefers-reduced-motion: reduce)');

		const handleChange = (event: MediaQueryListEvent) => {
			setPrefersReducedMotion(event.matches);
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);

	return prefersReducedMotion;
}

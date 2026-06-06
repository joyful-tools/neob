import { useEffect, useRef, useState, type ReactNode } from 'react';

interface InViewProperties {
	readonly children: (props: { inView: boolean; visibility: 'visible' | 'hidden' }) => ReactNode;
	readonly once?: boolean;
	readonly root?: Element | null;
	readonly rootMargin?: string;
	readonly threshold?: number;
	readonly onviewchange?: (event: { inView: boolean }) => void;
}

/**
 * InView component wraps an IntersectionObserver to detect when children enter or leave the viewport.
 */
export function InView({ children, once = false, root, rootMargin = '0px', threshold = 0, onviewchange }: InViewProperties) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(false);
	const [visibility, setVisibility] = useState<'visible' | 'hidden'>('hidden');

	useEffect(() => {
		const element = containerRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return;
				const isIntersecting = entry.isIntersecting;

				setInView(isIntersecting);
				onviewchange?.({ inView: isIntersecting });

				if (isIntersecting) {
					// Hack: this is a Safari workaround, otherwise the element will not be rendered before the transition starts
					setTimeout(() => {
						setVisibility('visible');
					}, 0);

					if (once) {
						observer.unobserve(element);
					}
				} else {
					setVisibility('hidden');
				}
			},
			{
				root,
				rootMargin,
				threshold,
			},
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [once, root, rootMargin, threshold, onviewchange]);

	return <div ref={containerRef}>{children({ inView, visibility })}</div>;
}
InView.displayName = 'InView';

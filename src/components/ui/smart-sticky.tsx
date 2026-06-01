import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

export interface SmartStickyProps extends React.HTMLAttributes<HTMLDivElement> {
	readonly sticky?: (props: { stuck: boolean }) => React.ReactNode;
	readonly onStickyChange?: (stuck: boolean) => void;
	readonly children?: React.ReactNode;
}

function debounceAnimationFrame<TArgs extends unknown[]>(callback: (...args: TArgs) => void) {
	let id: number | null = null;
	return (...args: TArgs) => {
		if (id !== null) {
			cancelAnimationFrame(id);
		}
		id = requestAnimationFrame(() => {
			id = null;
			callback(...args);
		});
	};
}

/**
 * SmartSticky component.
 * Uses IntersectionObserver to detect when a sticky child element is stuck.
 */
export function SmartSticky({ sticky, onStickyChange, children, className, style, ...properties }: SmartStickyProps) {
	const [stuck, setStuck] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const stickyRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		onStickyChange?.(stuck);
	}, [stuck, onStickyChange]);

	useEffect(() => {
		const container = containerRef.current;
		const stickyElement = stickyRef.current;
		if (!container || !stickyElement) return;

		const observer = new IntersectionObserver(
			debounceAnimationFrame(([entry]) => {
				if (entry) {
					// When container scrolls, the stuck element moves inside the container bounds,
					// reaching an intersectionRatio of 1.0.
					setStuck(entry.intersectionRatio === 1);
				}
			}),
			{
				threshold: [1],
				root: container,
			},
		);

		observer.observe(stickyElement);

		return () => {
			observer.disconnect();
		};
	}, []);

	if (!sticky) {
		return null;
	}

	return (
		<div ref={containerRef} className={cn('relative', className)} style={{ paddingTop: '1px', ...style }} {...properties}>
			<div ref={stickyRef} className="sticky top-(--smartStickyTop,0px) z-10 mt-[-2px]">
				{sticky({ stuck })}
			</div>
			{children}
		</div>
	);
}
SmartSticky.displayName = 'SmartSticky';
